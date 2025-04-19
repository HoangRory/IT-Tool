import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function UpgradeRequestModal({ isOpen, onClose }) {
  const { user, updateRequestStatus } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSendRequest = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:5074/api/request/upgrade-requests',
        {}, // No body needed, backend uses authenticated username
        { withCredentials: true }
      );
      setIsRequestSent(true);
      updateRequestStatus('pending'); // Update requestStatus in AuthContext
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send upgrade request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsRequestSent(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const isPending = user?.requestStatus === 'pending';
  const isDenied = user?.requestStatus === 'denied';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">Upgrade to Premium</h2>
          {isPending ? (
            <p className="text-green-600 font-medium mt-2">Request sent successfully!</p>
          ) : isDenied ? (
            <p className="text-red-500 font-medium mt-2">You can't send a request right now.</p>
          ) : (
            <p className="text-sm text-gray-600 mt-2">
              Unlock exclusive features by upgrading to a premium account. Submit your request now!
            </p>
          )}

          <div className="mt-4 space-y-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {isPending ? (
              <button
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={handleClose}
              >
                Close
              </button>
            ) : isDenied ? (
              <button
                className="w-full px-4 py-2 bg-red-500 text-white rounded-md cursor-default"
                disabled
              >
                Request Denied
              </button>
            ) : (
              <>
                <button
                  className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  onClick={handleSendRequest}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Sending...
                    </>
                  ) : (
                    'Send Request'
                  )}
                </button>
                <button
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  onClick={handleClose}
                >
                  Not Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}