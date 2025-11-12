import { useState, useEffect, useCallback } from "react";
import axiosClient from "../axois";

const useFetch = (url, options = {}) => {
  const {
    method = "GET",
    autoFetch = true,
    body = null,
    headers = {},
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // main function
  const refetch = useCallback(
    async (overrideOptions = {}) => {
      setLoading(true);
      setError(null);

      try {

        // console.log("🚀 useFetch sending:",
        //   overrideOptions.body instanceof FormData
        //     ? [...overrideOptions.body.entries()]
        //     : overrideOptions.body
        // );



        const res = await axiosClient({
          // url,
          url: overrideOptions.url || url,
          method: overrideOptions.method || method,
          data: overrideOptions.body ?? body,
          headers: {
            ...headers,
            ...overrideOptions.headers,
          },
        });

        setData(res.data);


        return res;
      } catch (err) {
        console.error(" useFetch error:", err);

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message
        );


        return err.response;
      } finally {
        setLoading(false);
      }
    },
    [url, method, body, headers]
  );

  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, []);

  return { data, error, loading, refetch };
};

export default useFetch;
