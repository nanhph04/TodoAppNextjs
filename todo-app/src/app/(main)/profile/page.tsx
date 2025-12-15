"use client";
import { useAuth } from '@/logic/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!auth || (!auth.accessToken && !auth.isLoading)) {
            router.push("/login");
        }
    }, [auth, router]);

    if (!auth || auth.isLoading) {
        return null;
    }
    if (!auth.user) {
        return null;
    }
    const { user, permissions, logout } = auth;
    return (
        <div className="flex items-center justify-center py-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">User Profile</h1>
                <div className="mb-4">
                    <span className="block text-gray-600 font-semibold">Fullname:</span>
                    <span className="block text-lg text-gray-900">{user.fullName || "Không có tên"}</span>
                </div>
                <div className="mb-4">
                    <span className="block text-gray-600 font-semibold">Email:</span>
                    <span className="block text-lg text-gray-900">{user.email || "Không có email"}</span>
                </div>
                <div className="mb-4">
                    <span className="block text-gray-600 font-semibold">Roles:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {Array.isArray(user.roles) && user.roles.length > 0 ? (
                            user.roles.map((role: string) => (
                                <span key={role} className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{role}</span>
                            ))
                        ) : (
                            <span className="text-gray-400 italic">Không có vai trò</span>
                        )}
                    </div>
                </div>
                <div className="mb-6">
                    <span className="block text-gray-600 font-semibold mb-1">Permissions:</span>
                    <ul className="list-disc list-inside bg-gray-50 rounded p-3">
                        {permissions.length > 0 ? (
                            permissions.map((perm) => <li key={perm} className="text-gray-800 text-sm">{perm}</li>)
                        ) : (
                            <li className="text-gray-400 italic">No permissions assigned.</li>
                        )}
                    </ul>
                </div>
                <button
                    onClick={logout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 shadow"
                >
                    Log out
                </button>
            </div>
        </div>
    );
}