import React from 'react';
import { Timer, Award, Zap } from 'lucide-react';
import type { QuizQuestion } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  streak: number;
  timeLeft: number;
  isRevealed: boolean;
}

export function QuizCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  streak,
  timeLeft,
  isRevealed,
}: QuizCardProps) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-gray-700">Streak: {streak}</span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-gray-700">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-500" />
          <span className="font-semibold text-gray-700">{question.points} pts</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h2>

      <div className="grid gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !isRevealed && onSelectAnswer(index)}
            className={`p-4 rounded-lg text-left transition-all ${
              selectedAnswer === null
                ? 'hover:bg-blue-50 bg-gray-50'
                : isRevealed
                ? index === question.correctAnswer
                  ? 'bg-green-100 border-green-500'
                  : selectedAnswer === index
                  ? 'bg-red-100 border-red-500'
                  : 'bg-gray-50'
                : selectedAnswer === index
                ? 'bg-blue-100 border-blue-500'
                : 'bg-gray-50'
            } ${
              isRevealed ? 'cursor-default' : 'cursor-pointer'
            } border-2 ${
              selectedAnswer === index ? 'border-blue-500' : 'border-transparent'
            }`}
            disabled={isRevealed}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}