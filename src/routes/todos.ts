import { Router, Request, Response } from 'express';
import Todo from '../models/Todo';
import { CreateTodoDto, UpdateTodoDto } from '../types/Todo';

const router = Router();

// GET /api/todos - Get all todos with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { completed, priority, category, search } = req.query;
    
    let filter: any = {};
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET /api/todos/:id - Get a specific todo
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req: Request, res: Response) => {
  try {
    const todoData: CreateTodoDto = req.body;
    
    if (!todoData.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const todo = new Todo({
      ...todoData,
      dueDate: todoData.dueDate ? new Date(todoData.dueDate) : undefined
    });
    
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updateData: UpdateTodoDto = req.body;
    
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate) as any;
    }
    
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// GET /api/todos/stats - Get todo statistics
router.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ completed: true });
    const pendingTodos = totalTodos - completedTodos;
    
    const priorityStats = await Todo.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    const categoryStats = await Todo.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({
      total: totalTodos,
      completed: completedTodos,
      pending: pendingTodos,
      byPriority: priorityStats,
      byCategory: categoryStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
