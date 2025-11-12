import { useParams, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import TButton from "../../components/core/TButton";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import LoadingSpin from "../../components/core/LoadingSpin";
import ErrorDisplay from "../../components/core/ErrorDisplay";
import axiosClient from "../../axois";
import QuestionViewer from "../../components/questions/QuestionViewer";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";

const SurveyView = () => {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(`/surveys/view/${slug}`);
  const survey = data?.data;
  const { currentUser } = useStateContext();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const isCreator = currentUser && survey && currentUser.id === survey.user_id;

  const handleEdit = () => navigate(`/surveys/edit/${survey.slug}`);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this survey?");
    if (!confirmed) return;

    try {
      await axiosClient.delete(`/surveys/${id}`);
      alert("Survey deleted successfully!");
      navigate("/surveys");
    } catch (error) {
      console.error("Error deleting survey:", error);
      alert(error.response?.data?.message || "Failed to delete the survey. Please try again.");
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await axiosClient.post(`/surveys/${survey.id}/answer`, {
        answers,
      });
      setSubmitMessage("✅ Survey submitted successfully!");
      setAnswers({});
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitMessage("❌ Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpin text="Survey" />;
  if (error) return <ErrorDisplay type="Survey" error={error} />;
  if (!survey) return <ErrorDisplay type="Survey" error="Survey not found" />;

  return (
    <div className="max-w-3xl mx-auto bg-white text-gray-900 dark:text-gray-100 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <img
        src={survey.image}
        alt={survey.title}
        className="w-full h-64 object-cover"
      />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{survey.title}</h1>

        {isCreator && survey.id && (
          <div className="mt-4 flex space-x-3 justify-between mb-5">
            <TButton color="gray" onClick={handleEdit}>
              <FaEdit className="w-5 h-5 mr-2" />
              Edit
            </TButton>

            <TButton color="red" onClick={() => handleDelete(survey.id)}>
              <FaTrashAlt className="w-4 h-4 mr-2" />
              Delete
            </TButton>
          </div>
        )}

        <div className="info mb-3 text-gray-500">
          exp:<span className="text-gray-400"> {survey.expire_at}</span>
        </div>
        <p className="text-gray-400 mb-4">{survey.description}</p>

        {survey.questions && survey.questions.length > 0 && (
          <form onSubmit={handleSubmit}>
            <QuestionViewer
              questions={survey.questions}
              answers={answers}
              onChange={handleAnswerChange}
            />

            <div className="mt-6 text-center">
              <TButton
                color="blue"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Answers"}
              </TButton>

              {submitMessage && (
                <p className="mt-3 text-sm text-center">
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SurveyView;
