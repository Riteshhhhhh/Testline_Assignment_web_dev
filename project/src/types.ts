export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface GameState {
  currentQuestion: number;
  score: number;
  streak: number;
  answers: number[];
  isComplete: boolean;
  timePerQuestion: number[];
}