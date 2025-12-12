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
        <div>
            <h1>Users Page</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <table border={1} cellPadding={8} style={{ marginTop: 16 }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData.map((user: any, idx: number) => (
                            <tr key={user._id || user.id || idx}>
                                <td>{idx + 1}</td>
                                <td>{user.name || user.fullName || user.username || ''}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}