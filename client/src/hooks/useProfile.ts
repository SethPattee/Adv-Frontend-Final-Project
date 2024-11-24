// import { useQuery } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import axiosInstance from '../utils/axiosInstance';

// type Profile = {
//   id: number;
//   username: string;
//   avatar_url: string;
//   bio: string;
//   astromoney_balance: number;
// };

// const fetchProfile = async (): Promise<Profile> => {
//   const { data } = await axiosInstance.get('/api/profile');
//   return data;
// };

// export const useProfile = () => {
//   const { data, error, isLoading } = useQuery({
//     queryKey: ['profile'],
//     queryFn: fetchProfile,
//   });

//   if (error) {
//     toast.error(`Failed to load profile: ${error.message}`);
//   }

//   return { data, isLoading };
// };
