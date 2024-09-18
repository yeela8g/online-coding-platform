const { codeBlockSchema } = require("./model.js");

const INITIAL_CODE = {
  1: `// Write a function that takes an array of numbers and returns the sum of the elements.
function sumArray(arr) {
  // Your code here
}`,
  2: `// Write a function that takes a string and returns the string reversed.
function reverseString(str) {
  // Your code here
}`,
  3: `// Write a function that checks if a given number is even.
function isEven(num) {
  // Your code here
}`,
  4: `// Write a function that returns the maximum number in an array.
function findMax(arr) {
  // Your code here
}`,
};

const INITIAL_SOLUTION = {
  1: `// Write a function that takes an array of numbers and returns the sum of the elements.
function sumArray(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
  2: `// Write a function that takes a string and returns the string reversed.
function reverseString(str) {
    return str.split('').reverse().join('');
}`,
  3: `// Write a function that checks if a given number is even.
function isEven(num) {
 return num % 2 === 0;
}`,
  4: `// Write a function that returns the maximum number in an array.
function findMax(arr) {
  return Math.max(...arr);
}`,
};

const VALID_ID_RANGE = ["1", "2", "3", "4"];

const resetCode = async (id) => {
  if (!VALID_ID_RANGE.includes(id)) {
    return { status: 400 };
  }
  let codeblock = await codeBlockSchema.findOne({ id });
  codeblock.code = INITIAL_CODE[id];
  await codeblock.save();
};

const getCodeService = async (id) => {
  if (!VALID_ID_RANGE.includes(id)) {
    return { status: 400 };
  }
  let codeblock = await codeBlockSchema.findOne({ id });
  if (!codeblock || codeblock === false || codeblock === null) {
    const initialcode = INITIAL_CODE[parseInt(id)];
    const solution = INITIAL_SOLUTION[id];
    codeblock = new codeBlockSchema({ id, code: initialcode, solution });
    await codeblock.save();
  }
  return { id: codeblock.id, code: codeblock.code, status: 200 };
};

const addCodeService = async (id, newCode) => {
  const result = await codeBlockSchema.updateOne(
    { id: id },
    { $set: { code: newCode } }
  );
  return { status: 200 };
};

module.exports = { getCodeService, addCodeService, resetCode };
