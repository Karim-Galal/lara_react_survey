import React from "react";
import { v4 as uuidv4 } from "uuid";
import TButton from "../core/TButton";
import QuestionEditor from "./QuestionEditor";

const SurveyQuestions = ({ questions, onSurveyUpdate }) => {
  const addQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      type: "text",
      question: "",
      description: "",
      data: {},
    };
    onSurveyUpdate({ questions: [...questions, newQuestion] });
  };

  const updateQuestion = (id, updated) => {
    const updatedQs = questions.map((q) => (q.id === id ? { ...q, ...updated } : q));
    onSurveyUpdate({ questions: updatedQs });
  };

  const deleteQuestion = (id) => {
    const filtered = questions.filter((q) => q.id !== id);
    onSurveyUpdate({ questions: filtered });
  };

  return (
    <div className="mt-6 p-2 md:p-4 border border-gray-400 dark:border-gray-700 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-indigo-400">Survey Questions</h3>
        <TButton color="gray" onClick={addQuestion}>
          + Add Question
        </TButton>
      </div>

      {questions.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">No questions added yet.</p>
      )}

      <div className="space-y-4">
        {questions.map((q , i) => (
          <QuestionEditor
            key={q.id}
            num={i}
            question={q}
            onChange={(updated) => updateQuestion(q.id, updated)}
            onDelete={() => deleteQuestion(q.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SurveyQuestions;
