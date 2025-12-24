"use client";
import React, { use } from 'react';
import { userService } from '@/data/services/user.service';

export default function UsersPage() {
    const [usersData, setUsersData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await userService.getAllUsers();
                setUsersData(response.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);


    return (
        <div className="bg-gray-50 py-8 px-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-6">Users Page</h1>
            {loading && <p className="text-gray-500 text-lg">Loading...</p>}
            {error && <p className="text-red-500 text-lg">{error}</p>}
            {!loading && !error && (
                <div className="overflow-x-auto w-full max-w-3xl">
                    <table className="min-w-full bg-white shadow rounded-lg">
                        <thead>
                            <tr className="bg-blue-100 text-blue-800">
                                <th className="py-2 px-4 text-left">#</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Role</th>
                                <th className="py-2 px-4 text-left">Permission</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map((user: any, idx: number) => (
                                <tr key={user._id || user.id || idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="py-2 px-4">{idx + 1}</td>
                                    <td className="py-2 px-4">{user.name || user.fullName || user.username || ''}</td>
                                    <td className="py-2 px-4">{user.email}</td>
                                    <td className="py-2 px-4">
                                        {Array.isArray(user.roles) && user.roles.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role: string) => (
                                                    <span key={role} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{role}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">-</span>
                                        )}
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}