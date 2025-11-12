
import { useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { Link , useNavigate} from "react-router-dom";
import TButton from "../../components/core/TButton";
import { FaTrashAlt , FaEdit } from "react-icons/fa";
import LoadingSpin from "../../components/core/LoadingSpin";
import ErrorDisplay from "../../components/core/ErrorDisplay";
import axoisClient from "../../axois";
import QuestionViewer from "../../components/questions/QuestionViewer";
import { useState } from "react";
// import { FaEdit } from "react-icons/fa";



import useFetch from "../../hooks/useFetch";

const SurveyView = () => {
  // const { id } = useParams();
  const { slug } = useParams();
  // const [survey, setSurvey] = useState({});


  const { data, loading, error, } = useFetch(`/surveys/view/${slug}`);
  const survey = data?.data;

  const {currentUser} = useStateContext();

  const isCreator = currentUser && survey && currentUser.id === survey.user_id;

  const navigate = useNavigate();

  const handleEdit = () => navigate(`/surveys/edit/${survey.slug}`);

  const handleDelete = async (id) => {

    const confirmed = window.confirm("Are you sure you want to delete this survey?");
    if (!confirmed) return;

    try {

      await axoisClient.delete(`/surveys/${id}`);


      alert("Survey deleted successfully!");

      navigate("/surveys");

    } catch (error) {
      console.error("Error deleting survey:", error);
      alert(
        error.response?.data?.message ||
        "Failed to delete the survey. Please try again."
      );
    }
  };

  // question related
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (loading) return <LoadingSpin text="Survey"/>;
  if (error) return <ErrorDisplay type="Survey" error={error} />
  if (!survey) return <ErrorDisplay type="Survey" error="Survey not found" />


  return (
    <div className="max-w-3xl mx-auto bg-white text-gray-900 dark:text-gray-100 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <img
        src={survey.image}
        alt={survey.title}
        className="w-full h-64 object-cover"
      />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{survey.title}</h1>


        {isCreator &&  survey.id &&  (
          <div className="mt-4 flex space-x-3 justify-between mb-5">
            <TButton color="gray"
              onClick={() =>handleEdit()}
              >
              <FaEdit className="w-5 h-5 mr-2" />
              Edit
            </TButton>

            {/* Delete Button (only if user is the creator) */}

              <TButton color="red"
                onClick={()=>handleDelete(survey.id)}
              >
                <FaTrashAlt className="w-4 h-4 mr-2" />
                Delete
              </TButton>
          </div>
        )}

        <div className="info mb-3 text-gray-500">
          exp:<span className="text-gray-400"> {survey.expire_at }</span>
        </div>
        <p className="text-gray-400 mb-4">{survey.description}</p>

        {/* {survey.questions && survey.questions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Questions</h2>
            <ul className="list-disc pl-5 space-y-1">
              {survey.questions.map((q) => (
                <li key={q.id}>{q.question}</li>
              ))}
            </ul>
          </div>
        )} */}
        {survey.questions && (
        <QuestionViewer
          questions={survey.questions}
          answers={answers}
          onChange={handleAnswerChange}
        />
      )}
      </div>
    </div>
  );
};

export default SurveyView;
