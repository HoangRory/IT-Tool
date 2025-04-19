import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserManagement() {
    const [allUsers, setAllUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [sortBy, setSortBy] = useState('default');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const usersPerPage = 10;
    const roles = ['All Roles', 'user', 'premium', 'admin'];

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
            applyFiltersAndSort('', 'All Roles', 'default', data);
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
            setFilteredUsers([]);
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
        setCurrentPage(1);
        applyFiltersAndSort(term, selectedRole, sortBy, allUsers);
    };

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        setCurrentPage(1);
        applyFiltersAndSort(searchTerm, role, sortBy, allUsers);
    };

    const handleSortChange = (e) => {
        const sortOption = e.target.value;
        setSortBy(sortOption);
        setCurrentPage(1);
        applyFiltersAndSort(searchTerm, selectedRole, sortOption, allUsers);
    };

    const applyFiltersAndSort = (term, role, sortOption, usersList) => {
        let filtered = [...usersList];

        if (term.trim() !== '') {
            filtered = filtered.filter(user =>
                user.username.toLowerCase().includes(term.toLowerCase())
            );
        }

        if (role !== 'All Roles') {
            filtered = filtered.filter(user => user.role.toLowerCase() === role.toLowerCase());
        }

        if (sortOption === 'name') {
            filtered.sort((a, b) => a.username.localeCompare(b.username));
        } else if (sortOption === 'role') {
            filtered.sort((a, b) => a.role.localeCompare(b.role));
        }

        setFilteredUsers(filtered);
        const startIndex = 0;
        setDisplayedUsers(filtered.slice(startIndex, startIndex + usersPerPage));
        setError(filtered.length === 0 ? 'No users found matching the criteria.' : null);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setPageInput(''); // Clear input after navigation
            const startIndex = (pageNumber - 1) * usersPerPage;
            setDisplayedUsers(filteredUsers.slice(startIndex, startIndex + usersPerPage));
        }
    };

    const handlePageInputChange = (e) => {
        setPageInput(e.target.value);
    };

    const handlePageInputSubmit = (e) => {
        if (e.key === 'Enter') {
            const pageNumber = parseInt(pageInput, 10);
            if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
                handlePageChange(pageNumber);
            } else {
                toast.error(`Please enter a valid page number between 1 and ${totalPages}`, {
                    autoClose: 3000
                });
                setPageInput('');
            }
        }
    };

    const handleRoleToggle = (user) => {
        const currentRole = user.role.toLowerCase();
        const newRole = currentRole === 'premium' ? 'user' : 'premium';

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
                applyFiltersAndSort(searchTerm, selectedRole, sortBy, updatedUsers);
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

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-5">
            <ToastContainer
                position="top-center"
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
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by username..."
                    className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="w-1/4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {roles.map(role => (
                        <option key={role} value={role}>{role === 'All Roles' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}</option>
                    ))}
                </select>
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="w-1/4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="default">Sort: Default</option>
                    <option value="name">Sort: Name (A-Z)</option>
                    <option value="role">Sort: Role (A-Z)</option>
                </select>
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
                        <div className="flex justify-center items-center space-x-2 mt-4">
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
                            {totalPages <= 5 ? (
                                Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                                ))
                            ) : (
                                <>
                                    {currentPage > 3 && (
                                        <>
                                            <button
                                                onClick={() => handlePageChange(1)}
                                                className={`px-3 py-1 rounded-md text-sm ${
                                                    currentPage === 1
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                1
                                            </button>
                                            {currentPage > 4 && <span className="px-2 text-sm text-gray-700">...</span>}
                                        </>
                                    )}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                                        const page = startPage + i;
                                        if (page <= totalPages) {
                                            return (
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
                                            );
                                        }
                                        return null;
                                    })}
                                    {currentPage < totalPages - 2 && (
                                        <>
                                            {currentPage < totalPages - 3 && <span className="px-2 text-sm text-gray-700">...</span>}
                                            <button
                                                onClick={() => handlePageChange(totalPages)}
                                                className={`px-3 py-1 rounded-md text-sm ${
                                                    currentPage === totalPages
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
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
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={pageInput}
                                    onChange={handlePageInputChange}
                                    onKeyPress={handlePageInputSubmit}
                                    placeholder={`1-${totalPages}`}
                                    className="w-16 p-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                />
                                <span className="ml-2 text-sm text-gray-700">of {totalPages}</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}