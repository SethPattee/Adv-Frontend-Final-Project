

import React, { useState } from "react";
import "./styles/BlogPage.scss";
import GenericFormInput from "./GenericFormInputBlogProfile";
import GridLayout from "./generic/GridLayout";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  date: string;
}

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const handleNewPost = (formData: { title: string; content: string }) => {
    const newPost: BlogPost = {
      id: posts.length + 1,
      title: formData.title,
      content: formData.content,
      date: new Date().toLocaleString(),
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="blog-page container mt-5">
      <h1 className="text-center text-light mb-4">Astro Blog</h1>
      <div className="blog-form mb-5">
        <GenericFormInput
          onSubmit={handleNewPost}
          titlePlaceholder="Your Starry Blog Title..."
          contentPlaceholder="Write your cosmic thoughts here..."
          buttonText="Publish Blog"
        />
      </div>
      <div className="blog-list">
        {posts.length === 0 ? (
          <p className="text-light text-center">No blogs yet. Be the first to write about the cosmos!</p>
        ) : (
          <GridLayout gap="3rem">
            {posts.map((post) => (
              <div key={post.id} className="blog-post card mb-4">
                <div className="card-body">
                  <h3 className="card-title text-primary">{post.title}</h3>
                  <p className="card-text">{post.content}</p>
                  <small className="text-muted">Published on: {post.date}</small>
                </div>
              </div>
            ))}
          </GridLayout>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
