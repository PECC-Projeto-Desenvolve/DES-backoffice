/**
 * Interface for updateCategory function properties.
 * @interface
 */
interface IUpdateCategoryProps {
    /** Unique identifier for the category to be updated */
    id: string;

    /** New name to update the category with */
    newName: string;

    /** Callback function that is called when the response is successfully completed */
    responseCompleted: () => void;
}

/**
 * Asynchronously updates a category's name by its ID and calls a callback function upon successful completion.
 *
 * @param {IUpdateCategoryProps} { id, newName, responseCompleted } - The properties required for updating a category.
 * @returns {Promise<void>} A promise that resolves when the operation is completed.
 */
export const updateCategory = async ({ id, newName, responseCompleted }: IUpdateCategoryProps): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newName })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Callback function is called when the response is successful
    responseCompleted();

    console.log('Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
  }
};
