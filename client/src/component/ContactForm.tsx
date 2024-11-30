import React, { useState, ChangeEvent, FormEvent } from "react";

interface ContactFormProps {
  onSubmit: (contactData: { name: string; email: string; subject: string; message: string }) => void;
  title?: string;
  buttonText?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  title = "Get in Touch with Us!",
  buttonText = "Send Message",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "subject") setSubject(value);
    if (name === "message") setMessage(value);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, subject, message });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <form className="contact-form" onSubmit={handleFormSubmit}>
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
        <label htmlFor="subject" className="form-label">
          Subject
        </label>
        <input
          type="text"
          className="form-control"
          id="subject"
          name="subject"
          placeholder="Enter the subject..."
          value={subject}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea
          className="form-control"
          id="message"
          name="message"
          rows={4}
          placeholder="Write your message here..."
          value={message}
          onChange={handleInputChange}
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-info w-100">
        {buttonText}
      </button>
    </form>
  );
};

export default ContactForm;
