import { useStateContext } from "../contexts/ContextProvider";
import SurveysListItem from "./SurveysListItem";
import { useEffect, } from "react";
import useFetch from "../hooks/useFetch";
import Pagination from "./core/Pagination";

const SurveysList = () => {
  const { surveysList, setSurveysList } = useStateContext();
  // const [pageUrl, setPageUrl] = useState("/surveys");

  const { data, loading, error } = useFetch('/surveys/');

  useEffect(() => {
    if (data?.data) {
      setSurveysList(data.data);
    }
  }, [data, setSurveysList]);

  if (loading)
    return <p className="text-center text-gray-500">Loading surveys...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error}</p>;

  const handlePageChange = (url) => {
    setPageUrl(url);
  };

  return (
    <div className="w-full">
      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {surveysList.length > 0 ? (
          surveysList.map((survey) => (
            <SurveysListItem key={survey.id} survey={survey} />
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-2">
            No surveys available.
          </p>
        )}
      </div>

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default SurveysList;
