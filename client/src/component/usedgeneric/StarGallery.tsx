import React from "react";
import GridLayout from "../generic/GridLayout";
import "../styles/StarGallery.scss";

const starImages = [
  { id: 1, src: "image1.jpg", alt: "Star 1" },
  { id: 2, src: "image2.jpg", alt: "Star 2" },
  { id: 3, src: "image3.jpg", alt: "Star 3" },
  { id: 4, src: "image4.jpg", alt: "Star 4" },
  { id: 5, src: "image5.jpg", alt: "Star 5" },
  { id: 6, src: "image6.jpg", alt: "Star 6" },
  { id: 7, src: "image7.jpg", alt: "Star 7" },
  { id: 8, src: "image8.jpg", alt: "Star 8" },
  { id: 9, src: "image9.jpg", alt: "Star 9" },
  { id: 10, src: "image10.jpg", alt: "Star 10" },
  { id: 11, src: "image11.jpg", alt: "Star 11" },
  { id: 12, src: "image12.jpg", alt: "Star 12" },
  { id: 13, src: "image13.jpg", alt: "Star 13" },
  { id: 14, src: "image14.jpg", alt: "Star 14" },
  { id: 15, src: "image15.jpg", alt: "Star 15" },
  { id: 16, src: "image16.jpg", alt: "Star 16" },
  { id: 17, src: "image17.jpg", alt: "Star 17" },
  { id: 18, src: "image18.jpg", alt: "Star 18" },
];

const StarGallery: React.FC = () => {
  return (
    <div className="star-gallery">
      <h1>Star Gallery</h1>
      <GridLayout gap="1.5rem">
        {starImages.map((image) => (
          <div key={image.id} className="star-image">
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default StarGallery;
