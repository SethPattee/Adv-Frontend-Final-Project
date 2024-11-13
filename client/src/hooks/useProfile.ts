// src/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Profile = {
    id: number;
    username: string;
    avatar_url: string;
    bio: string;
    astromoney_balance: number;
};

const fetchProfile = async (): Promise<Profile> => {
    const { data } = await axios.get('/api/profile');
    return data;
};

export const useProfile = () => {
  return useQuery({
      queryKey: ['profile'],
      queryFn: fetchProfile,
  });
};
