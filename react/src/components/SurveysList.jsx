import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import Pagination from "./core/Pagination";
import SurveysListItem from "./SurveysListItem";
import LoadingSpin from "./core/LoadingSpin";

export default function SurveysList() {
  const [pageUrl, setPageUrl] = useState("/surveys");
  const { data, loading, error, refetch } = useFetch(pageUrl);

  // Re-fetch only when pageUrl changes
  useEffect(() => {
    refetch(pageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageUrl]);

  const handlePageChange = (url) => {
    if (!url) return;
    const cleanUrl = url.replace("http://127.0.0.1:8000/api", "");
    setPageUrl(cleanUrl);
  };

  if (loading) return <LoadingSpin text="Surveys"/>;
  if (error) return <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        {String(error)}
                    </div>

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.data?.map((s) => (
          <SurveysListItem key={s.id} survey={s} />
        ))}

      </div>
      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={handlePageChange} />
      )}
    </>
  );
}
