import React, {  useState, useEffect } from "react";
import TButton from "../../components/core/TButton";
import { useStateContext } from "../../contexts/ContextProvider";
import useFetch from "../../hooks/useFetch";
import SurveyQuestions from "../../components/questions/SurveyQuestions";
import axoisClient from "../../axois";


const SurveyForm = ({survey= null}) => {


  const initialState = {
    title: "",
    description: "",
    imageUrl: null,
    imageFile: null,
    status: false,
    expire_at: "",
  };

  const [formData, setFormData] = useState(initialState);

  const [questions, setQuestions] = useState([]);
  const { userToken } = useStateContext();
  const { loading, data, error, refetch } = useFetch("/surveys", {
    method: "POST",
    autoFetch: false,
  });

  const isUpdate = !!survey?.id;

  useEffect(() => {
    if (survey) {
      setFormData({
        title: survey.title || "",
        description: survey.description || "",
        status: survey.status === 1,
        expire_at: survey.expire_at || "",
        imageUrl: survey.image || null, // backend field name
        imageFile: null,
      });

      //  load existing questions
      setQuestions(survey.questions || []);
    }
  }, [survey]);




  // 🔹 Update entire survey (title, desc, or questions)
  const onSurveyUpdate = (updatedFields) => {
    if (updatedFields.questions) setQuestions(updatedFields.questions);
    else setFormData((prev) => ({ ...prev, ...updatedFields }));
  };



  // const handleImageChange = (file) => {

  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       setFormData((prev) => ({
  //         ...prev,
  //         imageUrl: reader.result,
  //         imageFile: file,
  //       }));
  //     }
  //     reader.readAsDataURL(file);
  // };

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === "file" && files[0]) {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
        imageFile: file,
      }));

    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    // incase of update in sending to telling laravel that this is put not post
    if (survey?.id) {
      payload.append("_method", "PUT");
    }

    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("status", formData.status ? 1 : 0);
    payload.append("expire_at", formData.expire_at);
    if (formData.imageFile) payload.append("image", formData.imageFile);

    payload.append("questions", JSON.stringify(questions));

    // const method = survey?.id ? "PUT" : "POST";
    const method = "POST";
    const url = isUpdate ? `/surveys/${survey.id}` : "/surveys";

    console.log("Survey ID:", survey?.id);
    console.log("Final URL:", url);
    console.log("Payload contains _method:", [...payload.entries()]);

    console.log("Final URL being sent:", `${axoisClient.defaults.baseURL}${url}`);


    const response = await refetch({
      url,
      method,
      body: payload,
      headers: { Authorization: `Bearer ${userToken}`,
                "Content-Type": "multipart/form-data",
                },
    });

    console.log("Full response:", response);

    // after a successful submit clear form in case creating new survey
    if (response?.data?.success) {
      // in case we don't have old survey to update
      if (!survey) {
        setFormData(initialState);
        setQuestions([]);
      }
    }

  };


  return (
    <div className="mx-auto mt-10 bg-gray-100 dark:bg-gray-900 dark:text-gray-100 p-4 md:p-6 rounded-xl shadow-lg border border-gray-300 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-indigo-400 text-center">
        {!survey?.id ? 'Create New Survey' : 'Update Survey'}

      </h2>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border-red-300 border-1">
          {error}
        </div>
      )}

      {data?.success && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-green-400 border-green-300 border-1">
            {data?.message || 'survey created succesfully'}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
        {/* Image */}
        <div>
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-full max-w-sm mx-auto mb-3 rounded-lg shadow-md"
            />
          )}

          <label htmlFor="imageUrl" className="block mb-2 text-sm font-medium">
            Upload Image
          </label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium">
            Survey Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Employee Satisfaction Survey"
            className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>

          <label htmlFor="description" className="block mb-2 text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Write a short description for this survey..."
            className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          ></textarea>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="status"
            name="status"
            checked={formData.status === true}
            onChange={handleChange}
            className="w-6 h-6 rounded-md border-2 cursor-pointer transition duration-200
            bg-gray-200 dark:bg-gray-800 border-gray-600 checked:bg-indigo-600 checked:border-indigo-600"
          />
          <label htmlFor="status" className="text-sm font-medium cursor-pointer select-none">
            Make this survey public
          </label>
        </div>

        {/* Expiration Date */}
        <div>
          <label htmlFor="expire_at" className="block mb-2 text-sm font-medium">
            Expiration Date
          </label>
          <input
            type="date"
            id="expire_at"
            name="expire_at"
            value={formData.expire_at}
            onChange={handleChange}
            className="w-full p-3 bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Questions Section */}
        <SurveyQuestions questions={questions} onSurveyUpdate={onSurveyUpdate} />

        <div className="text-center">
          <TButton color="indigo" type="submit" disabled={loading}>
            {loading  ? "Saving..." : "Save Survey"}
          </TButton>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
