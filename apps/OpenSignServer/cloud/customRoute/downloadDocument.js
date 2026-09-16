import axios from 'axios';
import Parse from 'parse/node.js';
import { ensureParse } from './apiAuth.js';
import getPresignedUrl from '../parsefunction/getSignedUrl.js';

/**
 * Download / fetch a document PDF for external integrations.
 *
 * Auth: x-api-token (same as request-signature / resend-signature)
 * Input: document_id (query or body)
 *
 * Returns a short-lived download_url by default.
 * Pass as_file=true to stream the PDF bytes instead.
 */
async function handleDownloadDocument(req, res) {
  try {
    ensureParse();
    const extUser = req.extUser;
    const documentId = (
      req.body?.document_id ||
      req.body?.documentId ||
      req.query?.document_id ||
      req.query?.documentId ||
      ''
    ).trim();
    const asFile = parseBoolean(
      req.body?.as_file ?? req.body?.asFile ?? req.query?.as_file ?? req.query?.asFile,
      false
    );

    if (!documentId) {
      return res.status(400).json({
        status: 'error',
        message: 'document_id is required.',
      });
    }

    const query = new Parse.Query('contracts_Document');
    query.equalTo('objectId', documentId);
    query.include('ExtUserPtr');
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
    const fileUrl = document.SignedUrl || document.URL;

    if (!fileUrl) {
      return res.status(404).json({
        status: 'error',
        message: 'No file is available for this document yet.',
      });
    }

    const downloadUrl = getPresignedUrl(fileUrl);
    const fileName = `${(document.Name || 'document').replace(/[^a-zA-Z0-9._-]/g, '_')}.pdf`;
    const version = document.SignedUrl ? 'signed' : 'original';

    if (asFile) {
      const fileRes = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
        timeout: 60000,
      });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', fileRes.data.byteLength);
      return res.status(200).send(Buffer.from(fileRes.data));
    }

    return res.status(200).json({
      status: 'success',
      document_id: documentId,
      document_name: document.Name || '',
      is_completed: !!document.IsCompleted,
      is_declined: !!document.IsDeclined,
      version,
      file_name: fileName,
      download_url: downloadUrl,
      expires_in_seconds: 160,
      message:
        'Use download_url to download the PDF. The URL expires in about 160 seconds.',
    });
  } catch (err) {
    console.log('downloadDocument error', err);
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to download document.',
    });
  }
}

function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return value === true || value === 'true' || value === '1' || value === 1;
}

export default function downloadDocument(req, res) {
  return handleDownloadDocument(req, res);
}
