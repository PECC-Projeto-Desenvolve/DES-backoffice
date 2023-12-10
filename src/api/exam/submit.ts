/**
 * Interface defining the properties for submitting an exam.
 */
interface ISubmitCategoryProps {
    /**
     * Title of the exam.
     */
    title: string;

    /**
     * Array of question IDs to be included in the exam.
     */
    questionIds: Array<string>;

    /**
     * Optional callback function to be executed upon successful completion of the request.
     */
    responseCompleted?: () => void;

    /**
     * Optional callback function to be executed if the request is completed but not successful.
     */
    responseNotCompleted?: () => void;

    /**
     * Optional callback function to be executed in case of an error during the request.
     */
    responseError?: () => void;
}

/**
 * Asynchronously submits an exam with the provided title and question IDs.
 *
 * @param {ISubmitCategoryProps} props - Properties for submitting an exam, including title, question IDs, and optional callbacks.
 * @returns {Promise<void>} A promise that resolves to void.
 */
export const submitExam = async ({
  title,
  questionIds,
  responseCompleted,
  responseNotCompleted,
  responseError
}: ISubmitCategoryProps): Promise<void> => {

  try {
    const response = await fetch('http://localhost:3000/exams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, questionIds }),
    });

    if (!response.ok) {
      responseNotCompleted?.();
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    if (response.ok) {
      responseCompleted?.();
    }

    const responseData = await response.json();
    console.log('Resposta do servidor:', responseData);

  } catch (error) {
    responseError?.();
    console.error('Falha ao enviar os dados:', error);
  }
};
