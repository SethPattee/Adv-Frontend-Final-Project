import React from 'react';
import './styles/LinksPage.scss';

const LinksPage: React.FC = () => {
  const links = [
    { title: "Books", url: "/books" },
    { title: "Book Detail", url: "/books/:id" },
    { title: "Inventory Display", url: "/inv" },
    { title: "Inventory Management", url: "/inventory" },
    { title: "TanStack Example", url: "/tan" },
    { title: "Error Thrower", url: "/e" },
    { title: "Blog Page", url: "/g" },
    { title: "Feedback Page", url: "/f" },
    { title: "Contact Page", url: "/c" },
    { title: "Generic Page", url: "/gen" },
    { title: "Star Gallery", url: "/gallery" },
    { title: "Spinning Wheel", url: "/spin" },
    { title: "Links Page", url: "/links" },
  ];

  return (
    <div className="links-page">
      <div className="overlay">
        <h1 className="title">Explore the Cosmos</h1>
        <div className="container">
          <div className="row">
            {links.map((link, index) => (
              <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <a href={link.url} className="link-item btn btn-outline-light">
                  {link.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinksPage;
