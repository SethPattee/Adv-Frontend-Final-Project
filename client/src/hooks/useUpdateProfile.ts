// src/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type ProfileUpdate = Partial<{
    bio: string;
    avatar_url: string;
}>;

const updateProfile = async (profileUpdate: ProfileUpdate) => {
    const { data } = await axios.put('/api/profile', profileUpdate);
    return data;
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: updateProfile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });
  };