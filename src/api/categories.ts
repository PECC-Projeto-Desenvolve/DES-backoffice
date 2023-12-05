// src/api/categoryApi.ts
interface EditCategoryParams {
    id: string;
    newName: string;
}

export const editCategoryName = async ({ id, newName }: EditCategoryParams): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newName }),
    });

    if (!response.ok) {
      throw new Error('Falha ao editar a categoria');
    }

    const updatedCategory = await response.json();
    console.log('Categoria atualizada:', updatedCategory);
  } catch (error) {
    console.error('Erro ao editar a categoria:', error);
  }
};
