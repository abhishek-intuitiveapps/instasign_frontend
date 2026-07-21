import Parse from 'parse/node.js';
import dotenv from 'dotenv';
import { cloudServerUrl } from '../../Utils.js';

dotenv.config();

function ensureParse() {
  if (!Parse.applicationId) {
    Parse.initialize(process.env.APP_ID, undefined, process.env.MASTER_KEY);
    Parse.serverURL = process.env.SERVER_URL || cloudServerUrl;
    Parse.masterKey = process.env.MASTER_KEY;
  }
}

/**
 * Resolve InstaSign extended user from x-api-token (or Authorization: Bearer).
 */
export async function validateApiToken(req, res, next) {
  try {
    ensureParse();
    const headerToken =
      req.headers['x-api-token'] ||
      (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();

    if (!headerToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Missing API token. Pass it in the x-api-token header.',
      });
    }

    const query = new Parse.Query('contracts_Users');
    query.equalTo('ApiToken', headerToken);
    query.include('UserId');
    query.include('TenantId');
    const extUser = await query.first({ useMasterKey: true });

    if (!extUser) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid API token.',
      });
    }

    req.extUser = extUser;
    req.apiToken = headerToken;
    return next();
  } catch (err) {
    console.log('apiAuth error', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to validate API token.',
    });
  }
}

export { ensureParse };
