import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserManagement() {
    const [allUsers, setAllUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const loadingToast = toast.loading('Loading users...');
        setError(null);
        try {
            const response = await fetch('/api/account/users', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setAllUsers(data);
            setDisplayedUsers(data.slice(0, usersPerPage));
            toast.update(loadingToast, {
                render: 'Users loaded successfully',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again.');
            setAllUsers([]);
            setDisplayedUsers([]);
            toast.update(loadingToast, {
                render: 'Failed to load users',
                type: 'error',
                isLoading: false,
                autoClose: 3000
            });
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setError(null);
        setCurrentPage(1); // Reset to first page on new search

        let filteredUsers;
        if (term.trim() === '') {
            filteredUsers = allUsers;
        } else {
            filteredUsers = allUsers.filter(user =>
                user.username.toLowerCase().includes(term.toLowerCase())
            );
            if (filteredUsers.length === 0) {
                setError('No users found matching the search term.');
            }
        }

        setDisplayedUsers(filteredUsers.slice(0, usersPerPage));
    };

    const handleRoleToggle = (user) => {
        const currentRole = user.role.toLowerCase();
        const newRole = currentRole === 'premium' ? 'user' : 'premium';

        // Show confirmation toast
        toast(
            <div>
                <p>Are you sure you want to {newRole === 'premium' ? 'upgrade' : 'downgrade'} {user.username} to {newRole}?</p>
                <div className="flex justify-end space-x-2 mt-2">
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => performRoleToggle(user, newRole)}
                    >
                        Confirm
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        onClick={() => toast.dismiss()}
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false
            }
        );
    };

    const performRoleToggle = async (user, newRole) => {
        const loadingToast = toast.loading(`Updating role for ${user.username}...`);
        try {
            const response = await fetch(`/api/account/user/${user.username}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole }),
                credentials: 'include'
            });

            if (response.ok) {
                const updatedUsers = allUsers.map(u =>
                    u.username === user.username ? { ...u, role: newRole } : u
                );
                setAllUsers(updatedUsers);

                const filteredUsers = updatedUsers.filter(u =>
                    u.username.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const startIndex = (currentPage - 1) * usersPerPage;
                setDisplayedUsers(filteredUsers.slice(startIndex, startIndex + usersPerPage));

                toast.update(loadingToast, {
                    render: `Role updated to ${newRole} successfully`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000
                });
            } else {
                throw new Error('Failed to update role');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            setError('Failed to update role. Please try again.');
            toast.update(loadingToast, {
                render: 'Failed to update role',
                type: 'error',
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const filteredUsers = searchTerm.trim() === ''
            ? allUsers
            : allUsers.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const startIndex = (pageNumber - 1) * usersPerPage;
        setDisplayedUsers(filteredUsers.slice(startIndex, startIndex + usersPerPage));
        setError(filteredUsers.length === 0 ? 'No users found matching the search term.' : null);
    };

    const totalPages = Math.ceil(
        (searchTerm.trim() === ''
            ? allUsers.length
            : allUsers.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())).length) / usersPerPage
    );

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-5">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <h1 className="text-2xl font-bold">User Management</h1>
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by username..."
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}
            {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-md">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Username</th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Email</th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Role</th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b text-sm text-gray-900">{user.username}</td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-900">{user.email}</td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-900">{user.role}</td>
                                        <td className="px-4 py-2 border-b text-sm">
                                            {user.role.toLowerCase() !== 'admin' ? (
                                                <button
                                                    onClick={() => handleRoleToggle(user)}
                                                    className={`px-4 py-1 rounded-md text-white text-sm font-medium ${
                                                        user.role.toLowerCase() === 'premium' 
                                                        ? 'bg-red-500 hover:bg-red-600' 
                                                        : 'bg-green-500 hover:bg-green-600'
                                                    }`}
                                                >
                                                    {user.role.toLowerCase() === 'premium' ? 'Downgrade' : 'Upgrade'}
                                                </button>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center space-x-2 mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md text-sm ${
                                    currentPage === 1
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded-md text-sm ${
                                        currentPage === page
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md text-sm ${
                                    currentPage === totalPages
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}