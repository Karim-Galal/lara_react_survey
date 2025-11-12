import React, { useEffect, useReducer, useCallback, useRef } from "react";
import axiosClient from "../axois"; // ✅ keep your path

const initState = {
  loading: false,
  data: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PENDING":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, data: action.data, error: null };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        data: null,
        error: action.error || "Something went wrong!",
      };
    default:
      return state;
  }
};

const useFetch = (
  url,
  { method = "GET", body = null, autoFetch = true, headers = {} } = {}
) => {
  const [state, dispatch] = useReducer(reducer, initState);

  // ✅ useRef keeps stable references for body and headers so they don’t trigger re-renders
  const stableBody = useRef(body);
  const stableHeaders = useRef(headers);

  const fetchData = useCallback(
    async (options = {}) => {
      try {
        dispatch({ type: "FETCH_PENDING" });

        const finalMethod = (options.method || method).toUpperCase();
        const finalBody = options.body ?? stableBody.current;
        const finalHeaders = options.headers || stableHeaders.current;

        let response;
        switch (finalMethod) {
          case "POST":
            response = await axiosClient.post(url, finalBody, { headers: finalHeaders });
            break;
          case "PUT":
            response = await axiosClient.put(url, finalBody, { headers: finalHeaders });
            break;
          case "PATCH":
            response = await axiosClient.patch(url, finalBody, { headers: finalHeaders });
            break;
          case "DELETE":
            response = await axiosClient.delete(url, { headers: finalHeaders });
            break;
          default:
            response = await axiosClient.get(url, { headers: finalHeaders });
        }

        dispatch({ type: "FETCH_SUCCESS", data: response.data });
      } catch (error) {
        const message =
          error.response?.data?.message || error.message || "Something went wrong!";
        dispatch({ type: "FETCH_ERROR", error: message });
      }
    },
    [url, method] // ✅ body & headers removed — they’re stable via useRef
  );

  useEffect(() => {
    if (url && autoFetch) {
      fetchData();
    }
  }, [url, autoFetch, fetchData]);

  return {
    loading: state.loading,
    data: state.data,
    error: state.error,
    refetch: fetchData,
  };
};

export default useFetch;
