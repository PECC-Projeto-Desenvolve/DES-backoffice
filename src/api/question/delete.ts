const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Interface defining the properties for deleting a question.
 */
interface IDeleteQuestionProps {
    /**
     * ID of the question to be deleted.
     */
    id: number;

    /**
     * Optional callback function to be executed upon successful completion of the request.
     */
    responseCompleted?: () => void;
}

/**
 * Asynchronously deletes a question by its ID.
 *
 * @param {IDeleteQuestionProps} props - Properties for deleting a question, including the question ID and an optional callback.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const deleteQuestion = async ({ id, responseCompleted }: IDeleteQuestionProps): Promise<void> => {

  const convertId = id.toString();

  try {
    const response = await fetch(`${apiUrl}/questions/${convertId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar a questão');
    }

    responseCompleted?.();

    console.log('Questão deletada com sucesso');
  } catch (error) {
    console.error('Erro ao deletar a questão:', error);
  }
};
