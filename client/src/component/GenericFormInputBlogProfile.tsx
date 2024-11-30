import React, { useState, ChangeEvent, FormEvent } from 'react';

interface GenericFormInputProps {
  titlePlaceholder?: string;
  contentPlaceholder?: string;
  onSubmit: (formData: { title: string; content: string }) => void;
  buttonText?: string;
}

const GenericFormInput: React.FC<GenericFormInputProps> = ({
  titlePlaceholder = "Enter a title...",
  contentPlaceholder = "Write something about the stars...",
  onSubmit,
  buttonText = "Submit",
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "content") setContent(value);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <form className="generic-form" onSubmit={handleFormSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          name="title"
          placeholder={titlePlaceholder}
          value={title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          Content
        </label>
        <textarea
          className="form-control"
          id="content"
          name="content"
          rows={5}
          placeholder={contentPlaceholder}
          value={content}
          onChange={handleInputChange}
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">
        {buttonText}
      </button>
    </form>
  );
};

export default GenericFormInput;
