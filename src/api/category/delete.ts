const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Interface for deleteCategory function properties.
 * @interface
 */
interface IDeleteCategoryProps {
    /** Unique identifier for the category to be deleted */
    id: string;

    /** Callback function that is called when the response is successfully completed */
    responseCompleted: () => void;
}

/**
 * Asynchronously deletes a category by its ID and calls a callback function upon successful completion.
 *
 * @param {IDeleteCategoryProps} { id, responseCompleted } - The properties required for deleting a category.
 * @returns {Promise<void>} A promise that resolves when the operation is completed.
 */
export const deleteCategory = async ({ id, responseCompleted }: IDeleteCategoryProps): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}categories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar a categoria');
    }

    // Callback function is called when the response is successful
    responseCompleted();

    console.log('Categoria deletada com sucesso');
  } catch (error) {
    console.error('Erro ao deletar a categoria:', error);
  }
};
