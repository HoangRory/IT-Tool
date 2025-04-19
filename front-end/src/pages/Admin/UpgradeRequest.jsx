import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpgradeRequest() {
    const [allRequests, setAllRequests] = useState([]);
    const [displayedRequests, setDisplayedRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortByTime, setSortByTime] = useState('desc'); // 'desc' for newest, 'asc' for oldest
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const requestsPerPage = 10;

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        
        const loadingToast = toast.loading('Loading upgrade requests...');
        try {
            const response = await fetch('/api/request/upgrade-requests', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch upgrade requests');
            }
            const data = await response.json();
            setAllRequests(data);
            applyFiltersAndSort('', 'desc', data);
            toast.update(loadingToast, {
                render: 'Upgrade requests loaded successfully',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
        } catch (error) {
            console.error('Error fetching upgrade requests:', error);
            setError('Failed to load upgrade requests. Please try again.');
            setAllRequests([]);
            setFilteredRequests([]);
            setDisplayedRequests([]);
            toast.update(loadingToast, {
                render: 'Failed to load upgrade requests',
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
        applyFiltersAndSort(term, sortByTime, allRequests);
    };

    const handleSortChange = (e) => {
        const sortOption = e.target.value;
        setSortByTime(sortOption);
        setCurrentPage(1);
        applyFiltersAndSort(searchTerm, sortOption, allRequests);
    };

    const applyFiltersAndSort = (term, sortOption, requestsList) => {
        let filtered = [...requestsList];

        if (term.trim() !== '') {
            filtered = filtered.filter(request =>
                request.userName.toLowerCase().includes(term.toLowerCase())
            );
        }

        if (sortOption === 'asc') {
            filtered.sort((a, b) => new Date(a.timeCreated) - new Date(b.timeCreated));
        } else {
            filtered.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));
        }

        setFilteredRequests(filtered);
        const startIndex = 0;
        setDisplayedRequests(filtered.slice(startIndex, startIndex + requestsPerPage));
        setError(filtered.length === 0 ? 'No upgrade requests found matching the criteria.' : null);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setPageInput('');
            const startIndex = (pageNumber - 1) * requestsPerPage;
            setDisplayedRequests(filteredRequests.slice(startIndex, startIndex + requestsPerPage));
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

    const handleAcceptRequest = (request) => {
        const toastId = toast(
            <div>
                <p>Are you sure you want to accept the upgrade request for {request.userName}?</p>
                <div className="flex justify-end space-x-2 mt-2">
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => performUpdateRequest(request.id, 'Accepted', toastId)}
                    >
                        Confirm
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        onClick={() => toast.dismiss(toastId)}
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

    const handleDenyRequest = (request) => {
        const toastId = toast(
            <div>
                <p>Are you sure you want to deny the upgrade request for {request.userName}?</p>
                <div className="flex justify-end space-x-2 mt-2">
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => performUpdateRequest(request.id, 'Denied', toastId)}
                    >
                        Confirm
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        onClick={() => toast.dismiss(toastId)}
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

    const performUpdateRequest = async (requestId, status, toastId) => {
        const loadingToast = toast.loading(`Processing request...`);
        try {
            const response = await fetch(`/api/request/upgrade-requests/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status }),
                credentials: 'include'
            });

            if (response.ok) {
                const updatedRequests = allRequests.map(r =>
                    r.id === requestId ? { ...r, status } : r
                );
                setAllRequests(updatedRequests);
                applyFiltersAndSort(searchTerm, sortByTime, updatedRequests);
                toast.dismiss(toastId);
                toast.update(loadingToast, {
                    render: `Request ${status.toLowerCase()} successfully`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000
                });
            } else {
                throw new Error(`Failed to ${status.toLowerCase()} request`);
            }
        } catch (error) {
            console.error(`Error ${status.toLowerCase()} request:`, error);
            setError(`Failed to ${status.toLowerCase()} request. Please try again.`);
            toast.dismiss(toastId);
            toast.update(loadingToast, {
                render: `Failed to ${status.toLowerCase()} request`,
                type: 'error',
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

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
            <h1 className="text-2xl font-bold">Upgrade Requests</h1>
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by username..."
                    className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={sortByTime}
                    onChange={handleSortChange}
                    className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="desc">Sort: Newest First</option>
                    <option value="asc">Sort: Oldest First</option>
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
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Time Created</th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Status</th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedRequests.map(request => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b text-sm text-gray-900">{request.userName}</td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-900">{request.userEmail}</td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-900">
                                            {new Date(request.timeCreated).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-900">{request.status}</td>
                                        <td className="px-4 py-2 border-b text-sm">
                                            {request.status === 'Pending' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            console.log(request);
                                                            handleAcceptRequest(request);
                                                        }}
                                                        className="px-4 py-1 rounded-md text-white text-sm font-medium bg-green-500 hover:bg-green-600"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleDenyRequest(request)}
                                                        className="px-4 py-1 rounded-md text-white text-sm font-medium bg-red-500 hover:bg-red-600"
                                                    >
                                                        Deny
                                                    </button>
                                                </div>
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