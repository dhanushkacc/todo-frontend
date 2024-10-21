import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ResponseMessage = ({ message, statusCode }) => {
  const isSuccess = statusCode >= 200 && statusCode < 300; 
  const isError = statusCode >= 400 && statusCode < 600; 

  if (!message || (!isSuccess && !isError)) {
    return null;
  }

  return (
    <div
      className={`flex items-center p-4 mb-4 rounded-lg ${
        isSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isSuccess ? (
        <FaCheckCircle className="mr-3 text-green-500" />
      ) : (
        <FaTimesCircle className="mr-3 text-red-500" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default ResponseMessage;
