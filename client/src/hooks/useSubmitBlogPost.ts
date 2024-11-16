// src/hooks/useSubmitBlogPost.ts
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

// Define the types for the request and response
type NewBlogPost = {
  title: string;
  content: string;
};

type BlogPostResponse = {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
};

const submitBlogPost = async (newPost: NewBlogPost): Promise<BlogPostResponse> => {
  const { data } = await axiosInstance.post('/api/blog', newPost);
  return data;
};

export const useSubmitBlogPost = () => {
  return useMutation({
    mutationFn: submitBlogPost,
    onSuccess: (data) => {
      console.log('Blog post submitted:', data);
    },
    onError: (error) => {
      console.error('Error submitting blog post:', error);
    },
  });
};
