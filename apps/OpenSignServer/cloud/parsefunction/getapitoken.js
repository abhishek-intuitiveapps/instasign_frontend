/**
 * Return the existing API token for the logged-in user, if any.
 */
export default async function getapitoken(request) {
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

  const token = extUser.get('ApiToken') || '';
  return { result: 'success', token };
}
