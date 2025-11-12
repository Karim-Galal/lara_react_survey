import { useStateContext } from "../contexts/ContextProvider";
import SurveysListItem from "./SurveysListItem";
import { useEffect, useState  } from "react";
import useFetch from "../hooks/useFetch";
import Pagination from "./core/Pagination";



const SurveysList = () => {


  const { surveysList , setSurveysList } = useStateContext();

  const [meta, setMeta] = useState({});

  // fetch surveys from API
  const { data, loading, error,  } = useFetch("/surveys");
  // const { data, loading, error,  } = useFetch("/surveys");

  // when data changes, update context
  useEffect(() => {
    if (data?.data) {
      // assuming Laravel API Resource returns { data: [...] }
      setSurveysList(data.data);
      setMeta(data?.meta)



      console.log(data)
    }
  }, [data, setSurveysList]);


  // when loding
  if (loading) return <p className="text-center text-gray-500">Loading surveys...</p>;
  // if error
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 mb-10">
        {surveysList.length > 0 ? (
          surveysList.map((survey) => (
            <SurveysListItem key={survey.id} survey={survey} />
          ))
          // pagination
          // <Pagination meta={meta} />

        ) : (
          <p className="text-center text-gray-400 col-span-2">No surveys available.</p>
        )}
      </div>
      {data?.meta && (
        <Pagination meta={meta}  />
      )}
    </div>
  );
};

export default SurveysList;
