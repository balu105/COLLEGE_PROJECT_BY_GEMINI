
import React, { useState, useEffect, useCallback } from 'react';
import { generateTechnicalQuestions } from '../../services/aiClient';
import { TechnicalScore } from '../../types';

interface TechnicalAssessmentProps {
  role: string;
  skills: string[];
  onComplete: (score: TechnicalScore) => void;
}

const TechnicalAssessment: React.FC<TechnicalAssessmentProps> = ({ role, skills, onComplete }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [violations, setViolations] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await generateTechnicalQuestions(role, skills);
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [role, skills]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && started) {
      setViolations(v => v + 1);
      alert("Warning: Tab switching is detected during the test. This will be reported.");
    }
  }, [started]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      let score = 0;
      answers.forEach((ans, i) => {
        if (ans === questions[i].correctIndex) score++;
      });
      onComplete({
        score,
        total: questions.length,
        feedback: `Candidate completed technical assessment with ${score}/${questions.length} correct answers and ${violations} integrity violations.`,
        integrityViolations: violations
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Generating personalized test based on your skills...</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 border border-slate-200 shadow-xl text-center space-y-8">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <i className="fas fa-shield-alt text-3xl"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Proctored Assessment</h2>
          <p className="text-slate-500 mt-2">
            This test monitors activity to ensure integrity. Please do not switch tabs or exit fullscreen mode.
          </p>
        </div>
        <div className="space-y-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h4 className="font-bold text-slate-700">Rules:</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-500"></i>
              <span>Total Questions: {questions.length}</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-check text-green-500"></i>
              <span>Time Limit: 10 minutes</span>
            </li>
            <li className="flex items-center space-x-2">
              <i className="fas fa-exclamation-triangle text-amber-500"></i>
              <span>Tab switch detection active.</span>
            </li>
          </ul>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
        >
          I'm Ready to Begin
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">
          Question {currentIndex + 1} / {questions.length}
        </div>
        <div className={`px-4 py-2 rounded-xl border border-red-200 text-sm font-semibold flex items-center space-x-2 ${violations > 0 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-white text-slate-400'}`}>
          <i className="fas fa-shield-virus"></i>
          <span>Violations: {violations}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
        <h3 className="text-xl font-bold text-slate-800 leading-relaxed">
          {q.question}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {q.options.map((opt: string, idx: number) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all group flex items-center justify-between ${
                answers[currentIndex] === idx
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                  : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  answers[currentIndex] === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium text-slate-700">{opt}</span>
              </div>
              {answers[currentIndex] === idx && (
                <i className="fas fa-check-circle text-indigo-600"></i>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${
            currentIndex === 0 ? 'text-slate-300' : 'text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          Previous
        </button>
        <button
          disabled={answers[currentIndex] === undefined}
          onClick={handleNext}
          className={`px-12 py-3 rounded-xl font-bold shadow-lg transition-all ${
            answers[currentIndex] === undefined
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {currentIndex === questions.length - 1 ? 'Submit Test' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default TechnicalAssessment;
