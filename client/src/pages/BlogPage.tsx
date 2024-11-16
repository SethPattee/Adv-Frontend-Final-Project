// src/pages/BlogPage.tsx
import React, { useState } from 'react';
import { useSubmitBlogPost } from '../hooks/useSubmitBlogPost';
import toast from 'react-hot-toast';
import { useBlogPosts } from '../hooks/useBlogpost';

const BlogPage: React.FC = () => {
  const { data: blogPosts, isLoading, isError } = useBlogPosts();
  const mutation = useSubmitBlogPost();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!title || !content) {
      toast.error('Title and content are required.');
      return;
    }

    mutation.mutate({ title, content }, {
      onSuccess: (data) => {
        toast.success('Blog post submitted!');
        setTitle('');
        setContent('');
      },
      onError: (error) => {
        toast.error('Failed to submit blog post.');
      }
    });
  };

  if (isLoading) return <div>Loading blog posts...</div>;

  if (isError) return <div>Failed to load blog posts.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      
      <div>
        <h2 className="text-xl font-semibold">Submit a New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full p-2 border rounded-md mb-2"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="block w-full p-2 border rounded-md mb-2"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Submit
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Blog Posts</h2>
        {blogPosts?.map((post) => (
          <div key={post.id} className="border-b pb-2 mb-2">
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p>{post.content}</p>
            <p className="text-sm text-gray-500">
              Posted by User {post.user_id} on {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
