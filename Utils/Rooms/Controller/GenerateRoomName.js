const { uniqueNamesGenerator, colors } = require("unique-names-generator");
const fruits = require("../model/fruits");

const GenerateRandomName = () => {
  const randName = uniqueNamesGenerator({
    dictionaries: [fruits, fruits],
  });

  return randName;
};

module.exports = GenerateRandomName;
