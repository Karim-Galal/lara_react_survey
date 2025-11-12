import { Link } from "react-router-dom"

const SurveysListItem = ({survey}) => {

  const surveyLink = `/surveys/${survey.slug}`;

  return (
    <>

    <div className=" bg-whiteborder border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700">
        <Link to={surveyLink} >
            <img
              className="w-full h-48 object-cover rounded-t-lg"
              src={survey.image} alt={survey.title} />
        </Link>
        <div className="p-5">
            <Link to={surveyLink} >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"> {survey.title} </h5>
            </Link>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
                {survey.description}
            </p>
            <Link to={`/surveys/${survey.slug}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                View

                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </Link>
        </div>
    </div>
    </>
  )
}

export default SurveysListItem
