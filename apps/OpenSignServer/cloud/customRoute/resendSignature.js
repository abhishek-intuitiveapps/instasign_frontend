import axios from 'axios';
import Parse from 'parse/node.js';
import { cloudServerUrl, mailTemplate, replaceMailVaribles } from '../../Utils.js';
import { ensureParse } from './apiAuth.js';

const appId = process.env.APP_ID;

function publicOrigin() {
  const base = process.env.PUBLIC_URL || 'http://localhost:3000';
  try {
    return new URL(base).origin;
  } catch {
    return base.replace(/\/$/, '');
  }
}

function formatExpiryDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function hasSigned(auditTrail, email) {
  const normalized = (email || '').trim().toLowerCase();
  return (auditTrail || []).some(
    entry =>
      entry?.Activity === 'Signed' &&
      (entry?.UserPtr?.Email || '').trim().toLowerCase() === normalized
  );
}

function resolveMailTemplate(document) {
  const mailBody =
    document?.RequestBody || document?.ExtUserPtr?.TenantId?.RequestBody || '';
  const mailSubject =
    document?.RequestSubject || document?.ExtUserPtr?.TenantId?.RequestSubject || '';

  return { mailBody, mailSubject };
}

function buildMailContent(document, signer, signPdf) {
  const senderName = document?.ExtUserPtr?.Name || '';
  const senderEmail = document?.ExtUserPtr?.Email || '';
  const orgName = document?.ExtUserPtr?.Company || '';
  const localExpireDate = document?.ExpiryDate?.iso
    ? formatExpiryDate(document.ExpiryDate.iso)
    : '';

  const { mailBody, mailSubject } = resolveMailTemplate(document);

  if (mailBody && mailSubject) {
    const replacedRequestBody = mailBody.replace(/"/g, "'");
    const htmlReqBody =
      "<html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /></head><body>" +
      replacedRequestBody +
      '</body></html>';
    const variables = {
      document_title: document?.Name,
      sender_name: senderName,
      sender_mail: senderEmail,
      sender_phone: document?.ExtUserPtr?.Phone || '',
      receiver_name: signer?.Name || '',
      receiver_email: signer?.Email || '',
      receiver_phone: signer?.Phone || '',
      expiry_date: localExpireDate,
      company_name: orgName,
      signing_url: `<a href=${signPdf} target=_blank>Sign here</a>`,
    };
    return replaceMailVaribles(mailSubject, htmlReqBody, variables);
  }

  const mailparam = {
    senderName,
    senderMail: senderEmail,
    title: document.Name,
    organization: orgName,
    localExpireDate,
    sigingUrl: signPdf,
  };
  const fallback = mailTemplate(mailparam);
  return { subject: fallback.subject, body: fallback.body };
}

async function sendSigningMail(document, signer) {
  const hostUrl = publicOrigin();
  const encodeBase64 = Buffer.from(
    `${document.objectId}/${signer.Email}/${signer.objectId}`,
    'utf8'
  ).toString('base64');
  const signPdf = `${hostUrl}/login/${encodeBase64}`;
  const mailContent = buildMailContent(document, signer, signPdf);

  const params = {
    extUserId: document.ExtUserPtr.objectId,
    recipient: signer.Email,
    subject: mailContent.subject,
    from: document.ExtUserPtr.Email,
    replyto: document.ExtUserPtr.Email || '',
    html: mailContent.body,
  };

  const response = await axios.post(`${cloudServerUrl}/functions/sendmailv3`, params, {
    headers: {
      'Content-Type': 'application/json',
      'X-Parse-Application-Id': appId,
    },
  });

  return response?.data?.result;
}

function collectPendingSigners(document, targetEmail) {
  const placeholders = (document.Placeholders || []).filter(
    item => item?.signerObjId && item?.Role !== 'prefill'
  );

  let pending = placeholders
    .map(placeholder => {
      const signer = (document.Signers || []).find(
        item => item.objectId === placeholder.signerObjId
      );
      if (!signer?.Email) {
        return null;
      }
      if (hasSigned(document.AuditTrail, signer.Email)) {
        return null;
      }
      if (targetEmail && signer.Email.trim().toLowerCase() !== targetEmail) {
        return null;
      }
      return signer;
    })
    .filter(Boolean);

  if (document.SendinOrder && !targetEmail) {
    pending = pending.slice(0, 1);
  }

  return pending;
}

/**
 * Resend signing emails for a document that was already sent.
 */
async function handleResendSignature(req, res) {
  try {
    ensureParse();
    const extUser = req.extUser;
    const documentId = (
      req.body.document_id ||
      req.body.documentId ||
      req.query.document_id ||
      ''
    ).trim();
    const targetEmail = (req.body.email || req.body.receiver_email || '').trim().toLowerCase();

    if (!documentId) {
      return res.status(400).json({
        status: 'error',
        message: 'document_id is required.',
      });
    }

    const query = new Parse.Query('contracts_Document');
    query.equalTo('objectId', documentId);
    query.include('ExtUserPtr');
    query.include('ExtUserPtr.TenantId');
    query.include('Signers');
    query.include('AuditTrail.UserPtr');
    query.include('Placeholders');
    query.notEqualTo('IsArchive', true);
    const doc = await query.first({ useMasterKey: true });

    if (!doc) {
      return res.status(404).json({
        status: 'error',
        message: 'Document not found.',
      });
    }

    const docExtUserId = doc.get('ExtUserPtr')?.id || doc.get('ExtUserPtr')?.objectId;
    if (docExtUserId !== extUser.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have access to this document.',
      });
    }

    const document = JSON.parse(JSON.stringify(doc));

    if (!document.SignedUrl) {
      return res.status(400).json({
        status: 'error',
        message:
          'Document has not been sent yet. Open prepare_url, place signature fields, and send first.',
      });
    }

    if (document.IsCompleted) {
      return res.status(400).json({
        status: 'error',
        message: 'Document is already completed.',
      });
    }

    if (document.IsDeclined) {
      return res.status(400).json({
        status: 'error',
        message: 'Document was declined.',
      });
    }

    if (document.ExpiryDate?.iso) {
      const expireDate = new Date(document.ExpiryDate.iso).getTime();
      if (Date.now() > expireDate) {
        return res.status(400).json({
          status: 'error',
          message: 'Document has expired.',
        });
      }
    }

    const pendingSigners = collectPendingSigners(document, targetEmail);

    if (targetEmail && pendingSigners.length === 0) {
      const signerExists = (document.Signers || []).some(
        item => (item.Email || '').trim().toLowerCase() === targetEmail
      );
      if (!signerExists) {
        return res.status(404).json({
          status: 'error',
          message: 'No signer found with that email on this document.',
        });
      }
      if (hasSigned(document.AuditTrail, targetEmail)) {
        return res.status(400).json({
          status: 'error',
          message: 'That signer has already signed the document.',
        });
      }
      return res.status(400).json({
        status: 'error',
        message: 'No pending signers matched the request.',
      });
    }

    if (pendingSigners.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'All signers have already signed this document.',
      });
    }

    const results = [];
    for (const signer of pendingSigners) {
      try {
        const mailResult = await sendSigningMail(document, signer);
        results.push({
          email: signer.Email,
          name: signer.Name,
          contact_id: signer.objectId,
          status: mailResult?.status === 'success' ? 'sent' : 'failed',
        });
      } catch (err) {
        console.log('resendSignature mail error', err);
        results.push({
          email: signer.Email,
          name: signer.Name,
          contact_id: signer.objectId,
          status: 'failed',
        });
      }
    }

    const sentCount = results.filter(item => item.status === 'sent').length;
    if (sentCount === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to resend signing email.',
        document_id: documentId,
        results,
      });
    }

    return res.status(200).json({
      status: 'success',
      document_id: documentId,
      sent_count: sentCount,
      results,
      message:
        sentCount === 1
          ? 'Signing email resent successfully.'
          : `${sentCount} signing emails resent successfully.`,
    });
  } catch (err) {
    console.log('resendSignature error', err);
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to resend signing email.',
    });
  }
}

export default function resendSignature(req, res) {
  return handleResendSignature(req, res);
}
