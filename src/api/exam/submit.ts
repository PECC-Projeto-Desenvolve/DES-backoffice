interface ISubmitCategoryProps {
    title: string;

    questionIds: Array<string>;

    responseCompleted?: () => void;

    responseNotCompleted?: () => void;

    responseError?: () => void;
}

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
