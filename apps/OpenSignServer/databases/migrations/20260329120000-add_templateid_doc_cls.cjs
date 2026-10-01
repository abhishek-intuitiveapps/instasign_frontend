/**
 * Link documents created via request-signature to the layout template used.
 * @param {Parse} Parse
 */
exports.up = async Parse => {
  const docSchema = new Parse.Schema('contracts_Document');
  docSchema.addPointer('TemplateId', 'contracts_Template');
  await docSchema.update();
};

/**
 * @param {Parse} Parse
 */
exports.down = async Parse => {
  const docSchema = new Parse.Schema('contracts_Document');
  docSchema.deleteField('TemplateId');
  await docSchema.update();
};
