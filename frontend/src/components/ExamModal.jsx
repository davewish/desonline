import React, { useState } from "react";
import { X, CheckCircle, XCircle, Download } from "lucide-react";
import { examService } from "../services/api.js";

const ExamModal = ({ exam, onClose, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!exam) return null;

  const question = exam.questions[currentQuestion];
  const totalQuestions = exam.questions.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const passingScore = exam.passingScore || 70;

  const handleSelectAnswer = (answerIndex) => {
    if (!submitted) {
      setSelectedAnswers({
        ...selectedAnswers,
        [question.id.toString()]: answerIndex,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await examService.submitExam(exam.id, selectedAnswers);
      if (response.data.success) {
        setScore(response.data.data.score);
        setSubmitted(true);

        // Call onSubmit callback
        if (onSubmit) {
          onSubmit({
            examId: exam.id,
            score: response.data.data.score,
            correctAnswers: response.data.data.correctAnswers,
            totalQuestions: response.data.data.totalQuestions,
            passed: response.data.data.passed,
            answers: selectedAnswers,
          });
        }
      }
    } catch (err) {
      console.error("Exam submission error:", err);
      setError("Failed to submit exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  const handleDownloadCertificate = () => {
    // Mock certificate download
    alert("Certificate download started! (Mock feature)");
    // In real implementation, this would call API to generate PDF
  };

  // Show results screen
  if (submitted && score !== null) {
    const passed = score >= passingScore;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          {passed ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Congratulations! 🎓
              </h2>
              <p className="text-gray-600 mb-4">You passed the course exam!</p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Not Yet!
              </h2>
              <p className="text-gray-600 mb-4">
                You need {passingScore}% to pass this exam.
              </p>
            </>
          )}

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-4xl font-bold text-blue-600 mb-2">{score}%</p>
            <p className="text-gray-600 text-sm">
              You got {Math.round((score / 100) * totalQuestions)} out of{" "}
              {totalQuestions} questions correct
            </p>
          </div>

          <div className="space-y-3">
            {passed && (
              <button
                onClick={handleDownloadCertificate}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Certificate
              </button>
            )}
            <button
              onClick={handleRetake}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Retake Exam
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{exam.title}</h2>
            <p className="text-purple-100">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-1 bg-purple-600 transition-all"
            style={{
              width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
            }}
          ></div>
        </div>

        {/* Question */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {question.question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswers[question.id.toString()] === index
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[question.id.toString()] === index
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswers[question.id.toString()] === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Exam Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-orange-800">
              <strong>Note:</strong> You need {passingScore}% to pass this exam.
              You can retake it as many times as you need.
            </p>
          </div>

          {/* Question Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Submitting..." : "Submit Exam"}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Question Indicator Dots */}
          <div className="mt-8 flex flex-wrap gap-2">
            {exam.questions.map((q, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentQuestion
                    ? "bg-purple-600 w-8"
                    : selectedAnswers[q.id.toString()] !== undefined
                      ? "bg-green-600"
                      : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamModal;
