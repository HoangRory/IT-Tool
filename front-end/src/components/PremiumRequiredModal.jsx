import { X, AlertTriangle } from 'lucide-react';

export default function PremiumRequiredModal({ onClose }) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose} // Click nền để đóng
        >
            <div
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan ra ngoài
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-500 mt-1" size={28} />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Tính năng Premium</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Bạn cần nâng cấp tài khoản để sử dụng tính năng này.
                        </p>
                        <div className="mt-4 flex justify-center">
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                onClick={() => {
                                    alert('Chuyển đến trang nâng cấp...');
                                }}
                            >
                                Nâng cấp ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
