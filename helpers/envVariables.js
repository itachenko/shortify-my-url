module.exports.check = function (toCheck) {
  toCheck.forEach((variable) => {
    if (process.env[variable] === undefined || !process.env[variable].trim())
      throw new Error(`Required ENV variable [${variable}] is not set.`);
  });
};
