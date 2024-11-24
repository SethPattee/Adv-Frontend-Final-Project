// import type React from 'react';
// import { useState } from 'react';
// import { useProfile } from '../hooks/useProfile';
// import { useUpdateProfile } from '../hooks/useUpdateProfile';

// const CustomizeProfile: React.FC = () => {
//   const {
//     data: profile,
//     isError: profileError,
//     isLoading: profileLoading,
//   } = useProfile();
//   const updateProfileMutation = useUpdateProfile();

//   const [isEditing, setIsEditing] = useState(false);
//   const [editUsername, setEditUsername] = useState(profile?.username || '');
//   const [editBio, setEditBio] = useState(profile?.bio || '');

//   const handleSave = () => {
//     updateProfileMutation.mutate(
//       { bio: editBio },
//       {
//         onSuccess: () => {
//           setIsEditing(false);
//         },
//       },
//     );
//   };

//   if (profileLoading) return <div>Loading...</div>;
//   if (profileError) {
//     return (
//       <div className="p-6 max-w-md mx-auto bg-red-100 text-red-700 rounded-lg shadow-lg">
//         <h1 className="text-xl font-bold">Failed to load profile</h1>
//         <p>
//           Please try refreshing the page or contact support if the issue
//           persists.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-lg space-y-4">
//       <h1 className="text-2xl font-bold text-yellow-400">Customize Profile</h1>
//       <div className="flex items-center space-x-4">
//         <img
//           src={profile?.avatar_url}
//           alt="Avatar"
//           className="w-16 h-16 rounded-full"
//         />
//         <div>
//           {isEditing ? (
//             <>
//               <input
//                 type="text"
//                 value={editUsername}
//                 onChange={(e) => setEditUsername(e.target.value)}
//                 className="p-2 text-gray-900 rounded-md border border-gray-300"
//               />
//             </>
//           ) : (
//             <h2 className="text-xl font-semibold">{profile?.username}</h2>
//           )}
//           {isEditing ? (
//             <textarea
//               value={editBio}
//               onChange={(e) => setEditBio(e.target.value)}
//               className="mt-2 p-2 w-full text-gray-900 rounded-md border border-gray-300"
//             />
//           ) : (
//             <p className="text-gray-400">{profile?.bio}</p>
//           )}
//         </div>
//       </div>
//       <p>
//         Astromoney Balance:{' '}
//         <span className="font-semibold text-green-400">
//           {profile?.astromoney_balance}
//         </span>
//       </p>
//       {isEditing ? (
//         <div className="flex space-x-2">
//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={updateProfileMutation.isLoading}
//             className="px-4 py-2 bg-green-500 text-gray-900 rounded-md"
//           >
//             {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
//           </button>
//           <button
//             type="button"
//             onClick={() => setIsEditing(false)}
//             className="px-4 py-2 bg-red-500 text-gray-900 rounded-md"
//           >
//             Cancel
//           </button>
//         </div>
//       ) : (
//         <button
//           type="button"
//           onClick={() => {
//             setIsEditing(true);
//           }}
//           className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md"
//         >
//           Edit Profile
//         </button>
//       )}
//     </div>
//   );
// };

// export default CustomizeProfile;
