/**
 * Interface defining the properties for deleting an exam.
 */
interface IDeleteExamProps {
    /**
     * ID of the exam to be deleted.
     */
    id: string;

    /**
     * Optional callback function to be executed upon successful completion of the request.
     */
    responseCompleted?: () => void;
}

/**
 * Asynchronously deletes an exam by its ID.
 *
 * @param {IDeleteExamProps} props - Properties for deleting an exam, including the exam ID and an optional callback.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const deleteExam = async ({ id, responseCompleted }: IDeleteExamProps): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/exams/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar a prova');
    }

    responseCompleted?.();

    console.log('Prova deletada com sucesso');
  } catch (error) {
    console.error('Erro ao deletar a prova:', error);
  }
};
