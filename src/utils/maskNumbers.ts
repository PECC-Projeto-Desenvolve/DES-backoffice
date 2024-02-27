export function maskNumbers(input) {
  if (input.length <= 5) return input; // Se a string tiver 5 ou menos caracteres, retorna ela mesma
  const firstThree = input.slice(0, 3);
  const lastTwo = input.slice(-2);
  const maskedLength = input.length - 5;
  const halfMaskedLength = Math.floor(maskedLength / 2);
  const maskedPart = '*'.repeat(halfMaskedLength) + '.' + '*'.repeat(maskedLength - halfMaskedLength);
  return `${firstThree}.${maskedPart}-${lastTwo}`;
}
