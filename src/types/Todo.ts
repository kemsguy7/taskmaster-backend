
// src/types/Todo.ts
export interface ITodo {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
}
