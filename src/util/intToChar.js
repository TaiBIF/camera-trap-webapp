const intToChar = num => {
  if (isNaN(num)) {
    return '';
  }
  if (num > 25) {
    const a = Math.floor(num / 26) - 1;
    const b = num % 26;
    return `${intToChar(a)}${intToChar(b)}`;
  }
  return String.fromCharCode(97 + num);
};

export default intToChar;
