/**
 * Tipo que define os possíveis valores de chave para a resposta correta.
 */
type RightAnswerKey = '0' | '1' | '2' | '3' | '4';

/**
 * Dicionário para criptografar a resposta correta.
 */
const ENCRYPTION_KEY: { [key in RightAnswerKey]: string } = {
  '0': '48EBED9AD6D87DD35F89D3A69716F',
  '1': '27AB21FD4B98A191A8386668F7A61',
  '2': '6EEF636AC7C723C6F5BC3E5388172',
  '3': 'EDC4C367364D3C6BD9D38D1CCDCB1',
  '4': '6D328FE86E9C49A42F311D47E4B79',
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
