import React from "react";
import ContactForm from "./ContactForm";
import "./styles/ContactForm.scss";

const ContactPage: React.FC = () => {
  const handleContactSubmit = (contactData: { name: string; email: string; subject: string; message: string }) => {
    console.log("Contact Form Submitted:", contactData);
    alert("Thank you for reaching out! We'll get back to you soon.");
  };

  return (
    <div className="container mt-5">
      <ContactForm
        onSubmit={handleContactSubmit}
        title="Reach Out to the Stars"
        buttonText="Send Inquiry"
      />
    </div>
  );
};

export default ContactPage;
