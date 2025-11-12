import toast from "react-hot-toast";

export const useToast = () => {
  const notifySuccess = (message) =>
    toast.success(message || "Operation successful!");
  const notifyError = (message) =>
    toast.error(message || "Something went wrong!");
  const notifyInfo = (message) => toast(message, { icon: "ℹ️" });

  return { notifySuccess, notifyError, notifyInfo };
};
