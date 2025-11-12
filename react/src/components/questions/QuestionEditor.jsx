import React, { useState } from "react";
import TButton from "../core/TButton";
import { FaTrash } from "react-icons/fa";


const QuestionEditor = ({ question, onChange, onDelete , num}) => {

  const qsNum = num + 1;

  const [local, setLocal] = useState(question);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((prev) => ({ ...prev, [name]: value }));
    onChange({ [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const options = [...(local.data?.options || [])];
    options[index] = value;
    const updatedData = { ...local.data, options };
    setLocal((prev) => ({ ...prev, data: updatedData }));
    onChange({ data: updatedData });
  };

  const addOption = () => {
    const options = [...(local.data?.options || []), ""];
    const updatedData = { ...local.data, options };
    setLocal((prev) => ({ ...prev, data: updatedData }));
    onChange({ data: updatedData });
  };

  const removeOption = (index) => {
    const options = (local.data?.options || []).filter((_, i) => i !== index);
    const updatedData = { ...local.data, options };
    setLocal((prev) => ({ ...prev, data: updatedData }));
    onChange({ data: updatedData });
  };

  return (
    <div className="p-2 md:p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold text-indigo-400">Question.{qsNum} </h4>
        <TButton color="red" onClick={onDelete}> Delete</TButton>
      </div>

      <input
        type="text"
        name="question"
        value={local.question}
        onChange={handleChange}
        placeholder="Question text"
        className="w-full p-2 mb-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-400 dark:border-gray-600"
      />
      <textarea
        name="description"
        value={local.description}
        onChange={handleChange}
        rows="2"
        placeholder="Description (optional)"
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-400 dark:border-gray-600"
      ></textarea>

      <select
        name="type"
        value={local.type}
        onChange={handleChange}
        className="w-full p-2 mb-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-400 dark:border-gray-600"
      >
        <option value="text">Short Text</option>
        <option value="textarea">Long Text</option>
        <option value="checkbox">Checkbox</option>
        <option value="select">Select</option>

      </select>

      {(local.type === "checkbox" || local.type === "select") && (
        <div className="mb-2">
          <label className="text-sm font-medium me-2">Options    </label>
          {(local.data?.options || []).map((opt, i) => (
            <div key={i} className="flex flex-wrap gap-2 mb-1">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 mb"
              />
              <TButton color="red" size="sm"   onClick={() => removeOption(i)}>
                <FaTrash/>
              </TButton>
            </div>
          ))}
          <TButton color="gray" size='sm' onClick={addOption} className="mt-2">+ Add Option</TButton>
        </div>
      )}


    </div>
  );
};

export default QuestionEditor;
