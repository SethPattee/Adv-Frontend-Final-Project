// src/pages/CustomizeProfile.tsx
import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

const CustomizeProfile: React.FC = () => {
    const { data: profile, isLoading: profileLoading } = useProfile();
    const updateProfileMutation = useUpdateProfile();

    const handleUpdateProfile = () => {
        updateProfileMutation.mutate({ bio: 'Updated bio about exploring the stars!' });
    };

    if (profileLoading) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-lg space-y-4">
            <h1 className="text-2xl font-bold text-yellow-400">Customize Profile</h1>
            <div className="flex items-center space-x-4">
                <img src={profile?.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full" />
                <div>
                    <h2 className="text-xl font-semibold">{profile?.username}</h2>
                    <p className="text-gray-400">{profile?.bio}</p>
                </div>
            </div>
            <p>Astromoney Balance: <span className="font-semibold text-green-400">{profile?.astromoney_balance}</span></p>
            <button onClick={handleUpdateProfile} className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md">
                Update Bio
            </button>
        </div>
    );
};

export default CustomizeProfile;
