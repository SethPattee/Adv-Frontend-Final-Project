import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

type ProfileUpdate = Partial<{
  bio: string;
  avatar_url: string;
}>;

const updateProfile = async (profileUpdate: ProfileUpdate) => {
  const { data } = await axiosInstance.put('/api/profile', profileUpdate);
  return data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
};
