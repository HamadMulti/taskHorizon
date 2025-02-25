import { useState } from "react";
import { useUsers } from "../../../../hooks/useUsers";

interface CreateUserModalProps {
  onClose: () => void;
  onOpen: boolean;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onOpen }) => {
  const [isOpen, setIsOpen] = useState(onOpen);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });
  const { handleCreate } = useUsers()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData) {
      await handleCreate(userData);
      setUserData({
        username: "",
        email: "",
      })
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 p-4 flex justify-center items-start w-full h-full z-50 bg-[#35343494] bg-opacity-50 pt-20"
          aria-hidden={!isOpen}
        >
          {/* Modal Content */}
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 relative overflow-y-auto max-h-[80vh]">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={() => {
                setIsOpen(false);
                onClose();
              }}
            >
              ✕
            </button>

            {/* Modal Title */}
            <h3 className="text-yellow-600 text-xl font-bold mb-4">
              Create New User
            </h3>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  User Name
                </label>
                <input
                  type="text"
                  placeholder="Enter user name"
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-100 w-full text-gray-800 text-sm border-none focus:outline-yellow-600 focus:bg-transparent rounded-lg"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Enter user email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-100 w-full text-gray-800 text-sm border-none focus:outline-yellow-600 focus:bg-transparent rounded-lg"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg text-gray-800 text-sm bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    setIsOpen(false);
                    onClose();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg text-white text-sm bg-[#0c172b] hover:bg-[#0c172bea]"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateUserModal;
