import mongoose, { Schema, Document } from 'mongoose';
import { ITodo } from '../types/Todo';

interface TodoDocument extends Omit<ITodo, '_id'>, Document {}

const TodoSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    default: 'general',
    trim: true
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model<TodoDocument>('Todo', TodoSchema);
