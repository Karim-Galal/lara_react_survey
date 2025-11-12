import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import SurveyForm from "./SurveyForm";

const SurveyEdit = () => {
  const { slug } = useParams();
  const { data, loading, error  } = useFetch(`/surveys/${slug}`);
  const [survey, setSurvey] = useState(null);


  useEffect(() => {
    if (data?.data) {
      setSurvey(data.data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-700 dark:text-gray-300">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mr-3"></div>
        Loading survey...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-3">
          Failed to load survey
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {error.message || "Something went wrong. Please try again later."}
        </p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300 p-6">
        No survey found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md transition-all">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Edit Survey
      </h1>


      <SurveyForm survey={survey} />
    </div>
  );
};

export default SurveyEdit;
