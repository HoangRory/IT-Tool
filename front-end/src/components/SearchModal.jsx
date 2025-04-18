import { useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchModal({ isOpen, onClose, searchTerm, setSearchTerm, results }) {
    const navigate = useNavigate();
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-24"
            onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}>
                {/* Search input */}
                <div className="relative border-b px-4 py-3 shrink-0">
                    <input
                        autoFocus
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tools..."
                        className="w-full p-2 pl-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Results */}
                <div className="p-2 space-y-2 overflow-auto max-h-[calc(80vh-56px)]">
                    <div className="text-xs font-semibold text-gray-500">Tools</div>
                    {results.length > 0 ? (
                        results.map((tool, idx) => (
                            <div key={idx} className="p-2 hover:bg-green-100 rounded-lg cursor-pointer"
                                onClick={() => {
                                    navigate(`/${tool.path}`)
                                    onClose();
                                }}
                            >
                                <div className="font-medium">{tool.name}</div>
                                <div className="text-sm text-gray-500">{tool.description}</div>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 italic">No tools found...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
