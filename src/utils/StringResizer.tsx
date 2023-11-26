export const stringResizer = (str, maxChars) => {
  return str.length > maxChars ? str.substring(0, maxChars) : str;
};
