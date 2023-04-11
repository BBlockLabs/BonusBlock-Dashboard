module.exports = function (source) {
  this.callback(
    null,
    source
      .replaceAll(/<!--remove-on-prod-->[\s\S]*?<!--\/remove-on-prod-->/gi, "")
      .replaceAll(/\/\*remove-on-prod\*\/[\s\S]*?\/*\/remove-on-prod\*\//gi, "")
  );
};
