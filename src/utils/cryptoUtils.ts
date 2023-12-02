/**
 * Tipo que define os possíveis valores de chave para a resposta correta.
 */
type RightAnswerKey = '0' | '1' | '2' | '3' | '4';

/**
 * Dicionário para criptografar a resposta correta.
 */
const ENCRYPTION_KEY: { [key in RightAnswerKey]: string } = {
  '0': 'ABCDEFGHIJ',
  '1': 'JKLMNOPQRS',
  '2': 'TUVWXYZABC',
  '3': 'DEFGHIJKLM',
  '4': 'NOPQRSTUVW',
};

/**
 * Dicionário para descriptografar a resposta correta.
 */
const DECRYPTION_KEY = Object.fromEntries(
  Object.entries(ENCRYPTION_KEY).map(([key, value]) => [value, key])
) as { [key: string]: RightAnswerKey };

/**
 * Criptografa a resposta correta.
 *
 * @param {RightAnswerKey} answer - A resposta correta a ser criptografada.
 * @returns {string} A resposta criptografada.
 */
export function encryptRightAnswer(answer: RightAnswerKey): string {
  return ENCRYPTION_KEY[answer];
}

/**
 * Descriptografa a resposta criptografada e converte para uma letra correspondente.
 *
 * @param {string} encryptedAnswer - A resposta criptografada.
 * @returns {string} A letra correspondente à resposta descriptografada.
 */
export function decryptRightAnswer(encryptedAnswer: string): string {
  const decryptedString = DECRYPTION_KEY[encryptedAnswer];
  const index = parseInt(decryptedString, 10);
  return String.fromCharCode(64 + (index + 1));
}
