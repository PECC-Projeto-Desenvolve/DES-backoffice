/**
 * Interface for submitCategory function properties.
 * @interface
 */
interface ISubmitCategoryProps {
    /** Title of the category to be created */
    title: string;

    /** Color associated with the category */
    color: string;

    /** Callback function called when the response is successfully completed */
    responseCompleted: () => void;

    /** Callback function called when the response is completed but not successful */
    responseNotCompleted: () => void;

    /** Callback function called when there is an error in processing the request */
    responseError: () => void;
}

/**
 * Asynchronously submits a new category to the server.
 *
 * @param {ISubmitCategoryProps} { title, color, responseCompleted, responseNotCompleted, responseError } - The properties required for submitting a new category.
 * @returns {Promise<void>} A promise that resolves when the operation is completed, or rejects if an error occurs.
 */
export const submitCategory = async ({
  title,
  color,
  responseCompleted,
  responseNotCompleted,
  responseError
}: ISubmitCategoryProps): Promise<void> => {

  try {
    const response = await fetch('http://localhost:3000/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, color }),
    });

    if (!response.ok) {
      responseNotCompleted();
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    if (response.ok) {
      responseCompleted();
    }

    const responseData = await response.json();
    console.log('Resposta do servidor:', responseData);

  } catch (error) {
    responseError();
    console.error('Falha ao enviar os dados:', error);
  }
};
