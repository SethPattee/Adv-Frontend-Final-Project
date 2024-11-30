import React from "react";
import FeedbackForm from "./FeedbackForm";
import "./styles/FeedbackForm.scss";

const FeedbackPage: React.FC = () => {
  const handleFeedbackSubmit = (feedbackData: { name: string; email: string; message: string }) => {
    console.log("Feedback Submitted:", feedbackData);
    alert("Thank you for your feedback!");
  };

  return (
    <div className="container mt-5">
      <FeedbackForm
        onSubmit={handleFeedbackSubmit}
        title="Share Your Cosmic Feedback"
        buttonText="Send Feedback"
      />
    </div>
  );
};

export default FeedbackPage;
