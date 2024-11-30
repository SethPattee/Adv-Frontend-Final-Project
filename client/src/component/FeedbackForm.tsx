import React, { useState, ChangeEvent, FormEvent } from "react";

interface FeedbackFormProps {
  onSubmit: (feedbackData: { name: string; email: string; message: string }) => void;
  title?: string;
  buttonText?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  title = "We value your thoughts!",
  buttonText = "Submit Feedback",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "message") setMessage(value);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, message });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <form className="feedback-form" onSubmit={handleFormSubmit}>
      <h2 className="text-center text-light">{title}</h2>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          placeholder="Enter your name..."
          value={name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          placeholder="Enter your email..."
          value={email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">
          Your Feedback
        </label>
        <textarea
          className="form-control"
          id="message"
          name="message"
          rows={4}
          placeholder="Share your cosmic thoughts..."
          value={message}
          onChange={handleInputChange}
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-warning w-100">
        {buttonText}
      </button>
    </form>
  );
};

export default FeedbackForm;
