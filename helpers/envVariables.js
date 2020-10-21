module.exports.check = function (toCheck) {
  const missing = toCheck
    .map((variable) => {
      if (!process.env[variable]) return variable;
    })
    .filter(Boolean);
  const count = missing.length;
  if (count > 0)
    throw new Error(`Required ENV ${count > 1 ? "variables" : "variable"} ${missing} ${count > 1 ? "are" : "is"} not set.`);
};
