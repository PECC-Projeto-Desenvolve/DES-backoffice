import { decryptRightAnswer } from './';

/**
 * Calculates the correct answers for a candidate based on the provided ID.
 * Fetches data from an API and logs the candidate's name
 * and the count of correct answers based on the fetched data.
 *
 * @param {string} id - The unique identifier of the candidate's exam to calculate.
 */
export async function getCorrectAnswers(id: string): Promise<void> {
    try {
      // Fetch candidate data from API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/userexams/${id}`);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      const data = await response.json();
  
  
      // Fetch questions details
      if (data && data.questions) {
        const userQuestions = await Promise.all(
          data.questions.map(async (q: any) => {
            const questionResponse = await fetch(`${import.meta.env.VITE_API_URL}/questions/${q.questionId}`);
            if (!questionResponse.ok) {
              console.error(`Erro ao buscar detalhes da questão: ${questionResponse.status}`);
              return null;
            }
            const questionData = await questionResponse.json();
            return {
              ...q,
              statement: questionData.statement,
              title: questionData.title,
              image: questionData.image,
              rightAnswer: questionData.rightAnswer,
              difficulty: questionData.difficulty,
            };
          })
        );
  
        // Filter out any null questions
        const validQuestions = userQuestions.filter((q) => q !== null);
  
        // Function to determine if the answer is correct
        const handleResult = (userAnswer: number, rightAnswer: string) => {
          if (String.fromCharCode(64 + (userAnswer + 1)) === decryptRightAnswer(rightAnswer)) {
            return '✅';
          }
          return '❌';
        };
  
        // Questions to be canceled
        const questionsToCancel = [32, 36, 56];
  
        // Calculate correct answers
        const correctAnswersCount = validQuestions.reduce((acc, question) => {
          const isCorrect = handleResult(question.position, question.rightAnswer) === '✅';
          const shouldCancel = questionsToCancel.includes(question.questionId);
          if (isCorrect || (shouldCancel && !isCorrect)) {
            return acc + 1;
          } else {
            return acc;
          }
        }, 0);
  
        // Fetch to update the candidate's score
        try {
          const patchOptions = {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'api-key': `${import.meta.env.VITE_API_KEY}`
            },
            body: JSON.stringify({ newScore: correctAnswersCount })
          };
  
          const updateResponse = await fetch(`${import.meta.env.VITE_API_URL}/userexams/${id}/score`, patchOptions);
  
          if (!updateResponse.ok) {
            throw new Error('Erro ao atualizar a pontuação do candidato');
          }
  
        } catch (updateError) {
          console.error('Erro ao sincronizar a pontuação:', updateError , 'id:', id);
        }
  
      } else {
        console.error('Resposta da API não contém "questions"' , 'id:', id);
      }
    } catch (error) {
      console.error('Erro ao buscar candidato:', error , 'id:', id);
    }
  }
  