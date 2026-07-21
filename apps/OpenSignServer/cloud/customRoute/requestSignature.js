import multer from 'multer';
import Parse from 'parse/node.js';
import { flattenPdf, getSecureUrl } from '../../Utils.js';
import { ensureParse } from './apiAuth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname?.toLowerCase().endsWith('.pdf')) {
      return cb(null, true);
    }
    return cb(new Error('Only PDF files are allowed.'));
  },
}).single('file');

function publicOrigin() {
  const base = process.env.PUBLIC_URL || 'http://localhost:3000';
  try {
    return new URL(base).origin;
  } catch {
    return base.replace(/\/$/, '');
  }
}

function sanitizeFileName(name) {
  return (name || 'document.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
}

function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return value === true || value === 'true' || value === '1' || value === 1;
}

function parseReceivers(body) {
  const receivers = [];

  const rawReceivers = body.receivers ?? body.signers;
  if (rawReceivers) {
    let parsed = rawReceivers;
    if (typeof rawReceivers === 'string') {
      try {
        parsed = JSON.parse(rawReceivers);
      } catch {
        throw new Error('receivers must be a valid JSON array.');
      }
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('receivers must be a non-empty JSON array.');
    }
    parsed.forEach((receiver, index) => {
      const email = (receiver?.email || '').trim();
      if (!email) {
        throw new Error(`receivers[${index}].email is required.`);
      }
      receivers.push({
        email,
        name: (receiver?.name || '').trim(),
        phone: (receiver?.phone || '').trim(),
      });
    });
    return receivers;
  }

  const email = (body.email || '').trim();
  if (email) {
    receivers.push({
      email,
      name: (body.name || '').trim(),
      phone: (body.phone || '').trim(),
    });
  }

  return receivers;
}

async function findOrCreateContact(extUser, email, name, phone) {
  const ownerId = extUser.get('UserId')?.id || extUser.get('UserId')?.objectId;
  const ownerPtr = { __type: 'Pointer', className: '_User', objectId: ownerId };
  const normalizedEmail = email.trim().toLowerCase();

  const existing = new Parse.Query('contracts_Contactbook');
  existing.equalTo('CreatedBy', ownerPtr);
  existing.equalTo('Email', normalizedEmail);
  existing.notEqualTo('IsDeleted', true);
  const found = await existing.first({ useMasterKey: true });
  if (found) {
    return found;
  }

  const contact = new Parse.Object('contracts_Contactbook');
  contact.set('Name', name || normalizedEmail.split('@')[0]);
  contact.set('Email', normalizedEmail);
  if (phone) {
    contact.set('Phone', phone);
  }
  contact.set('UserRole', 'contracts_Guest');
  contact.set('IsDeleted', false);
  contact.set('CreatedBy', ownerPtr);

  const tenant = extUser.get('TenantId');
  if (tenant?.id || tenant?.objectId) {
    contact.set('TenantId', {
      __type: 'Pointer',
      className: 'partners_Tenant',
      objectId: tenant.id || tenant.objectId,
    });
  }

  let guestUser;
  try {
    const user = new Parse.User();
    user.set('name', name || normalizedEmail.split('@')[0]);
    user.set('username', normalizedEmail);
    user.set('email', normalizedEmail);
    user.set('password', normalizedEmail);
    if (phone) {
      user.set('phone', phone);
    }
    guestUser = await user.save(null, { useMasterKey: true });
  } catch (err) {
    if (err.code === 202) {
      const userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo('email', normalizedEmail);
      guestUser = await userQuery.first({ useMasterKey: true });
    } else {
      throw err;
    }
  }

  if (!guestUser) {
    throw new Error('Unable to resolve guest user for contact.');
  }

  contact.set('UserId', {
    __type: 'Pointer',
    className: '_User',
    objectId: guestUser.id,
  });

  const acl = new Parse.ACL();
  acl.setReadAccess(guestUser.id, true);
  acl.setWriteAccess(guestUser.id, true);
  acl.setReadAccess(ownerId, true);
  acl.setWriteAccess(ownerId, true);
  contact.setACL(acl);

  return contact.save(null, { useMasterKey: true });
}

async function uploadPdfBuffer(buffer, fileName) {
  const flatPdf = await flattenPdf(buffer);
  const parseFile = new Parse.File(sanitizeFileName(fileName), [...flatPdf], 'application/pdf');
  await parseFile.save({ useMasterKey: true });
  const secure = getSecureUrl(parseFile.url());
  return secure.url;
}

/**
 * Create a draft contracts_Document for external integrations.
 * Sender must open prepare_url to place signature widgets, then send from the UI.
 */
async function handleRequestSignature(req, res) {
  try {
    ensureParse();
    const extUser = req.extUser;
    const note = (req.body.note || 'Please review and sign this document.').trim();
    const documentName =
      (req.body.document_name || req.body.documentName || req.file?.originalname || 'Untitled Document')
        .replace(/\.pdf$/i, '')
        .trim();
    const timeToCompleteDays = parseInt(req.body.days || req.body.TimeToCompleteDays || '15', 10);
    const kycRequired = parseBoolean(
      req.body.kyc_required ?? req.body.kycRequired ?? req.body.KycRequired,
      false
    );
    const sendInOrder = parseBoolean(
      req.body.send_in_order ?? req.body.sendInOrder ?? req.body.SendinOrder,
      true
    );

    let receivers;
    try {
      receivers = parseReceivers(req.body);
    } catch (parseErr) {
      return res.status(400).json({ status: 'error', message: parseErr.message });
    }

    if (receivers.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one receiver is required. Use email or receivers JSON array.',
      });
    }
    if (!req.file?.buffer && !req.body.fileBase64) {
      return res.status(400).json({
        status: 'error',
        message: 'PDF file is required (multipart field "file" or JSON fileBase64).',
      });
    }

    let fileUrl;
    if (req.file?.buffer) {
      fileUrl = await uploadPdfBuffer(req.file.buffer, req.file.originalname || `${documentName}.pdf`);
    } else {
      const base64 = req.body.fileBase64.includes(',')
        ? req.body.fileBase64.split(',')[1]
        : req.body.fileBase64;
      fileUrl = await uploadPdfBuffer(Buffer.from(base64, 'base64'), `${documentName}.pdf`);
    }

    if (!fileUrl) {
      return res.status(500).json({ status: 'error', message: 'Failed to upload PDF.' });
    }

    const contacts = [];
    for (const receiver of receivers) {
      const contact = await findOrCreateContact(
        extUser,
        receiver.email,
        receiver.name,
        receiver.phone
      );
      contacts.push(contact);
    }

    const ownerId = extUser.get('UserId')?.id || extUser.get('UserId')?.objectId;

    const doc = new Parse.Object('contracts_Document');
    doc.set('Name', documentName);
    doc.set('Note', note);
    doc.set('URL', fileUrl);
    doc.set('KycRequired', kycRequired);
    doc.set('TimeToCompleteDays', Number.isFinite(timeToCompleteDays) ? timeToCompleteDays : 15);
    doc.set('SendinOrder', sendInOrder);
    doc.set('AutomaticReminders', false);
    doc.set('RemindOnceInEvery', 5);
    doc.set('IsTourEnabled', true);
    doc.set('AllowModifications', false);
    doc.set('IsEnableOTP', false);
    doc.set('CreatedBy', {
      __type: 'Pointer',
      className: '_User',
      objectId: ownerId,
    });
    doc.set('ExtUserPtr', {
      __type: 'Pointer',
      className: 'contracts_Users',
      objectId: extUser.id,
    });
    doc.set(
      'Signers',
      contacts.map(contact => ({
        __type: 'Pointer',
        className: 'contracts_Contactbook',
        objectId: contact.id,
      }))
    );

    const acl = new Parse.ACL();
    acl.setReadAccess(ownerId, true);
    acl.setWriteAccess(ownerId, true);
    contacts.forEach(contact => {
      const contactUserId = contact.get('UserId')?.id || contact.get('UserId')?.objectId;
      if (contactUserId) {
        acl.setReadAccess(contactUserId, true);
        acl.setWriteAccess(contactUserId, true);
      }
    });
    doc.setACL(acl);

    const saved = await doc.save(null, { useMasterKey: true });
    const prepareUrl = `${publicOrigin()}/placeHolderSign/${saved.id}`;

    return res.status(201).json({
      status: 'success',
      document_id: saved.id,
      prepare_url: prepareUrl,
      kyc_required: kycRequired,
      send_in_order: sendInOrder,
      receivers: contacts.map(contact => ({
        email: contact.get('Email'),
        name: contact.get('Name'),
        contact_id: contact.id,
      })),
      message:
        'Draft created. Open prepare_url while logged in as the document owner to place signature fields, then send.',
    });
  } catch (err) {
    console.log('requestSignature error', err);
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to create signature request.',
    });
  }
}

export default function requestSignature(req, res) {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    upload(req, res, err => {
      if (err) {
        return res.status(400).json({ status: 'error', message: err.message || 'Upload failed.' });
      }
      return handleRequestSignature(req, res);
    });
  } else {
    return handleRequestSignature(req, res);
  }
}
