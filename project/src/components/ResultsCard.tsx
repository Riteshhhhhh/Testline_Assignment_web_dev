import React from 'react';
import { Trophy, Clock, Zap, BarChart } from 'lucide-react';

interface ResultsCardProps {
  score: number;
  totalPossibleScore: number;
  maxStreak: number;
  averageTime: number;
  onRestart: () => void;
}

export function ResultsCard({
  score,
  totalPossibleScore,
  maxStreak,
  averageTime,
  onRestart,
}: ResultsCardProps) {
  const percentage = Math.round((score / totalPossibleScore) * 100);

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mx-auto">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
        <p className="text-gray-600">Here's how you did:</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-700">Score</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{score}/{totalPossibleScore}</p>
          <p className="text-sm text-gray-600">{percentage}% correct</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-gray-700">Best Streak</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{maxStreak}</p>
          <p className="text-sm text-gray-600">questions in a row</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-gray-700">Average Time</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{averageTime.toFixed(1)}s</p>
          <p className="text-sm text-gray-600">per question</p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}