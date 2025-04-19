import { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToolsContext } from '../../context/ToolsContext';

export default function ToolManagement() {
    const { refreshTools } = useContext(ToolsContext);
    const [allTools, setAllTools] = useState([]);
    const [displayedTools, setDisplayedTools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [sortBy, setSortBy] = useState('default');
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState('');
    const [filteredTools, setFilteredTools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const toolsPerPage = 10;

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        setLoading(true);
        setError(null);
        const loadingToast = toast.loading('Loading tools...');
        try {
            const response = await fetch('/api/tools/list', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tools');
            }
            const data = await response.json();
            setAllTools(data);
            applyFiltersAndSort('', 'All Categories', 'default', data);
            const uniqueCategories = ['All Categories', ...new Set(data.map(tool => tool.category))];
            setCategories(uniqueCategories);
            toast.update(loadingToast, {
                render: 'Tools loaded successfully',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
        } catch (error) {
            console.error('Error fetching tools:', error);
            setError('Failed to load tools. Please try again.');
            setAllTools([]);
            setFilteredTools([]);
            setDisplayedTools([]);
            setCategories(['All Categories']);
            toast.update(loadingToast, {
                render: 'Failed to load tools',
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
        applyFiltersAndSort(term, selectedCategory, sortBy, allTools);
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setCurrentPage(1);
        applyFiltersAndSort(searchTerm, category, sortBy, allTools);
    };

    const handleSortChange = (e) => {
        const sortOption = e.target.value;
        setSortBy(sortOption);
        setCurrentPage(1);
        applyFiltersAndSort(searchTerm, selectedCategory, sortOption, allTools);
    };

    const applyFiltersAndSort = (term, category, sortOption, toolsList) => {
        let filtered = [...toolsList];

        if (term.trim() !== '') {
            filtered = filtered.filter(tool =>
                tool.name.toLowerCase().includes(term.toLowerCase())
            );
        }

        if (category !== 'All Categories') {
            filtered = filtered.filter(tool => tool.category === category);
        }

        if (sortOption === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredTools(filtered);
        const startIndex = 0;
        setDisplayedTools(filtered.slice(startIndex, startIndex + toolsPerPage));
        setError(filtered.length === 0 ? 'No tools found matching the criteria.' : null);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setPageInput('');
            const startIndex = (pageNumber - 1) * toolsPerPage;
            setDisplayedTools(filteredTools.slice(startIndex, startIndex + toolsPerPage));
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

    const handleTogglePremium = (tool) => {
        const newStatus = !tool.isPremium;
        const toastId = toast(
            <div>
                <p>Are you sure you want to {newStatus ? 'set' : 'remove'} {tool.name} as {newStatus ? 'Premium' : 'non-Premium'}?</p>
                <div className="flex justify-end space-x-2 mt-2">
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => performTogglePremium(tool, newStatus, toastId)}
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

    const performTogglePremium = async (tool, newStatus, toastId) => {
        const loadingToast = toast.loading(`Updating premium status for ${tool.name}...`);
        try {
            const response = await fetch(`/api/tools/${tool.id}/premium`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isPremium: newStatus }),
                credentials: 'include'
            });

            if (response.ok) {
                const updatedTools = allTools.map(t =>
                    t.id === tool.id ? { ...t, isPremium: newStatus } : t
                );
                setAllTools(updatedTools);
                applyFiltersAndSort(searchTerm, selectedCategory, sortBy, updatedTools);
                await refreshTools(); // Refresh tools across the app
                toast.dismiss(toastId);
                toast.update(loadingToast, {
                    render: `Premium status updated to ${newStatus ? 'Premium' : 'non-Premium'} successfully`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000
                });
            } else {
                throw new Error('Failed to update premium status');
            }
        } catch (error) {
            console.error('Error updating premium status:', error);
            setError('Failed to update premium status. Please try again.');
            toast.dismiss(toastId);
            toast.update(loadingToast, {
                render: 'Failed to update premium status',
                type: 'error',
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    const handleToggleEnabled = (tool) => {
        const newStatus = !tool.isEnabled;
        const toastId = toast(
            <div>
                <p>Are you sure you want to {newStatus ? 'enable' : 'disable'} {tool.name}?</p>
                <div className="flex justify-end space-x-2 mt-2">
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => performToggleEnabled(tool, newStatus, toastId)}
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

    const performToggleEnabled = async (tool, newStatus, toastId) => {
        const loadingToast = toast.loading(`Updating enabled status for ${tool.name}...`);
        try {
            const response = await fetch(`/api/tools/${tool.id}/enabled`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isEnabled: newStatus }),
                credentials: 'include'
            });

            if (response.ok) {
                const updatedTools = allTools.map(t =>
                    t.id === tool.id ? { ...t, isEnabled: newStatus } : t
                );
                setAllTools(updatedTools);
                applyFiltersAndSort(searchTerm, selectedCategory, sortBy, updatedTools);
                await refreshTools(); // Refresh tools across the app
                toast.dismiss(toastId);
                toast.update(loadingToast, {
                    render: `Enabled status updated to ${newStatus ? 'Enabled' : 'Disabled'} successfully`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000
                });
            } else {
                throw new Error('Failed to update enabled status');
            }
        } catch (error) {
            console.error('Error updating enabled status:', error);
            setError('Failed to update enabled status. Please try again.');
            toast.dismiss(toastId);
            toast.update(loadingToast, {
                render: 'Failed to update enabled status',
                type: 'error',
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    const totalPages = Math.ceil(filteredTools.length / toolsPerPage);

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
            <h1 className="text-2xl font-bold">Tool Management</h1>
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by name..."
                    className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-1/4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="w-1/4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="default">Sort: Default</option>
                    <option value="name">Sort: Name (A-Z)</option>
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
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Name</th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Path</th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Category</th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Premium</th>
                                    <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Enabled</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedTools.map(tool => (
                                    <tr key={tool.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b text-sm text-gray-900">{tool.name}</td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-900">{tool.path}</td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-900">{tool.category}</td>
                                        <td className="px-4 py-2 border-b text-sm">
                                            <button
                                                onClick={() => handleTogglePremium(tool)}
                                                className={`px-4 py-1 rounded-md text-white text-sm font-medium ${
                                                    tool.isPremium 
                                                    ? 'bg-red-500 hover:bg-red-600' 
                                                    : 'bg-green-500 hover:bg-green-600'
                                                }`}
                                            >
                                                {tool.isPremium ? 'Remove Premium' : 'Set Premium'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 border-b text-sm">
                                            <button
                                                onClick={() => handleToggleEnabled(tool)}
                                                className={`px-4 py-1 rounded-md text-white text-sm font-medium ${
                                                    tool.isEnabled 
                                                    ? 'bg-red-500 hover:bg-red-600' 
                                                    : 'bg-green-500 hover:bg-green-600'
                                                }`}
                                            >
                                                {tool.isEnabled ? 'Disable' : 'Enable'}
                                            </button>
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