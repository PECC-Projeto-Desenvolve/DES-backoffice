interface IDeleteQuestionProps {
    id: number;
    responseCompleted?: () => void;
}

export const deleteQuestion = async ({ id, responseCompleted }: IDeleteQuestionProps): Promise<void> => {

  const convertId = id.toString();

  try {
    const response = await fetch(`http://localhost:3000/questions/${convertId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar a questão');
    }

    // Callback function is called when the response is successful
    responseCompleted();

    console.log('Questão deletada com sucesso');
  } catch (error) {
    console.error('Erro ao deletar a questão:', error);
  }
};
