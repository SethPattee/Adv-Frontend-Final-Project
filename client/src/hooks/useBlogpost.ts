// src/hooks/useBlogPosts.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

type BlogPost = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

const fetchBlogPosts = async () => {
    const { data } = await axiosInstance.get('/api/blog');
    return data;
  };
  

export const useBlogPosts = () => {
    return useQuery({
      queryKey: ['blogPosts'],
      queryFn: fetchBlogPosts,
    });
  };