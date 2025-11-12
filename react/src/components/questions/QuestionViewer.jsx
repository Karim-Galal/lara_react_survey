
import React from "react";

const QuestionViewer = ({ questions = [], answers = {}, onChange }) => {
  // if no questions exist
  if (!questions.length)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-6">
        No questions available for this survey.
      </p>
    );

  const renderQuestion = (q, ) => {
    // const { id, type, question, description, data } = q;
    const { id, type, data } = q;

    const handleInputChange = (e) => {
      const value =
        type === "checkbox"
          ? Array.from(
              e.target.closest("fieldset").querySelectorAll("input:checked")
            ).map((el) => el.value)
          : e.target.value;

      onChange?.(id, value);
    };

    const commonClass =
      "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 p-2";

    switch (type) {
      case "textarea":
        return (
          <textarea
            className={commonClass}
            rows="4"
            value={answers[id] || ""}
            onChange={handleInputChange}
            placeholder="Type your answer..."
          />
        );

      case "select":
        return (
          <select
            className={commonClass}
            value={answers[id] || ""}
            onChange={handleInputChange}
          >
            <option value="">Select an option</option>
            {data?.options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {data?.options?.map((opt, i) => (
              <label
                key={i}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${id}`}
                  value={opt}
                  checked={answers[id] === opt}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <fieldset className="space-y-2">
            {data?.options?.map((opt, i) => (
              <label
                key={i}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={opt}
                  checked={answers[id]?.includes(opt)}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </fieldset>
        );

      default:
        // text, number, date, etc.
        return (
          <input
            type={type || "text"}
            className={commonClass}
            value={answers[id] || ""}
            onChange={handleInputChange}
            placeholder="Type your answer..."
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <div
          key={q.id}
          className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {index + 1}. {q.question}
          </h3>
          {q.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {q.description}
            </p>
          )}

          {renderQuestion(q, index)}
        </div>
      ))}
    </div>
  );
};

export default QuestionViewer;
