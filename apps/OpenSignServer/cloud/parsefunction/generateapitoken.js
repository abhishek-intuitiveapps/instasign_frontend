import crypto from 'node:crypto';

/**
 * Generate or regenerate an API token for the logged-in user's contracts_Users record.
 * The plain token is returned once so the client can copy it; it is also stored on ExtUser.
 */
export default async function generateapitoken(request) {
  if (!request.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'User is not authenticated.');
  }

  const extQuery = new Parse.Query('contracts_Users');
  extQuery.equalTo('UserId', {
    __type: 'Pointer',
    className: '_User',
    objectId: request.user.id,
  });
  const extUser = await extQuery.first({ useMasterKey: true });

  if (!extUser) {
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'User not found.');
  }

  const token = crypto.randomBytes(32).toString('hex');
  extUser.set('ApiToken', token);
  await extUser.save(null, { useMasterKey: true });

  return { result: 'success', token };
}
