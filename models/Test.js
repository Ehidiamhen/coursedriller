import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{
    question: String,
    type: { type: String, enum: ['mcq', 'essay', 'obj'] },
    options: [String],
    correctAnswer: String,
    explanation: String,
  }],
  userAnswers: [String],
  score: Number,
  duration: Number,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Test', testSchema);