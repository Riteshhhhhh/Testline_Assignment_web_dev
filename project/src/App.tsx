import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import type { QuizQuestion, GameState } from './types';
import { QuizCard } from './components/QuizCard';
import { ResultsCard } from './components/ResultsCard';

const QUESTION_TIMEOUT = 20; // seconds per question

// Sample quiz data
const sampleQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    points: 10
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    points: 10
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "White Rhinoceros"],
    correctAnswer: 1,
    points: 10
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    points: 15
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Fe", "Au", "Cu"],
    correctAnswer: 2,
    points: 10
  }
];

function App() {
  const [questions] = useState<QuizQuestion[]>(sampleQuestions);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMEOUT);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    streak: 0,
    answers: [],
    isComplete: false,
    timePerQuestion: [],
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  React.useEffect(() => {
    let timer: number;
    if (gameStarted && !gameState.isComplete && !isRevealed) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(-1); // Time's up!
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameState.isComplete, isRevealed]);

  const handleAnswer = (answerIndex: number) => {
    const currentQ = questions[gameState.currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    const timeSpent = QUESTION_TIMEOUT - timeLeft;

    setSelectedAnswer(answerIndex);
    setIsRevealed(true);

    setTimeout(() => {
      setGameState((prev) => {
        const newState = {
          ...prev,
          answers: [...prev.answers, answerIndex],
          timePerQuestion: [...prev.timePerQuestion, timeSpent],
          score: isCorrect ? prev.score + currentQ.points : prev.score,
          streak: isCorrect ? prev.streak + 1 : 0,
        };

        if (prev.currentQuestion === questions.length - 1) {
          return { ...newState, isComplete: true };
        }

        return { ...newState, currentQuestion: prev.currentQuestion + 1 };
      });

      setSelectedAnswer(null);
      setIsRevealed(false);
      setTimeLeft(QUESTION_TIMEOUT);
    }, 2000);
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(QUESTION_TIMEOUT);
  };

  const restartGame = () => {
    setGameState({
      currentQuestion: 0,
      score: 0,
      streak: 0,
      answers: [],
      isComplete: false,
      timePerQuestion: [],
    });
    setTimeLeft(QUESTION_TIMEOUT);
    setSelectedAnswer(null);
    setIsRevealed(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-2xl w-full">
          <Brain className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Quiz!</h1>
          <p className="text-gray-600 mb-8">
            Test your knowledge with our interactive quiz. Answer questions correctly to build your streak
            and earn more points. But be quick - you only have {QUESTION_TIMEOUT} seconds per question!
          </p>
          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (gameState.isComplete) {
    const totalPossibleScore = questions.reduce((sum, q) => sum + q.points, 0);
    const maxStreak = Math.max(...gameState.answers.map((_, i, arr) => {
      let streak = 0;
      for (let j = i; j < arr.length; j++) {
        if (arr[j] === questions[j].correctAnswer) streak++;
        else break;
      }
      return streak;
    }));
    const averageTime = gameState.timePerQuestion.reduce((a, b) => a + b, 0) / questions.length;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <ResultsCard
          score={gameState.score}
          totalPossibleScore={totalPossibleScore}
          maxStreak={maxStreak}
          averageTime={averageTime}
          onRestart={restartGame}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full">
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Question {gameState.currentQuestion + 1} of {questions.length}
          </p>
        </div>
        
        <QuizCard
          question={questions[gameState.currentQuestion]}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleAnswer}
          streak={gameState.streak}
          timeLeft={timeLeft}
          isRevealed={isRevealed}
        />
      </div>
    </div>
  );
}

export default App;