import { useState } from "react";
import { useUsers } from "../../../../hooks/useUsers";

interface ChangePasswordModalProps {
  id: number;
  username: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  id,
  username
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleChangeUserPassword } = useUsers();

  const resetPasswords = () => {
    handleChangeUserPassword(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Delete Button to Open Modal */}
      <button className="mr-4" title="Change Password" onClick={() => setIsOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 fill-gray-400 hover:fill-yellow-700"
          viewBox="0 0 512 512"
        >
          <path
            d="M437.02 74.98C388.668 26.63 324.379 0 256 0S123.332 26.629 74.98 74.98C26.63 123.332 0 187.621 0 256s26.629 132.668 74.98 181.02C123.332 485.37 187.621 512 256 512s132.668-26.629 181.02-74.98C485.37 388.668 512 324.379 512 256s-26.629-132.668-74.98-181.02zM111.105 429.297c8.454-72.735 70.989-128.89 144.895-128.89 38.96 0 75.598 15.179 103.156 42.734 23.281 23.285 37.965 53.687 41.742 86.152C361.641 462.172 311.094 482 256 482s-105.637-19.824-144.895-52.703zM256 269.507c-42.871 0-77.754-34.882-77.754-77.753C178.246 148.879 213.13 114 256 114s77.754 34.879 77.754 77.754c0 42.871-34.883 77.754-77.754 77.754zm170.719 134.427a175.9 175.9 0 0 0-46.352-82.004c-18.437-18.438-40.25-32.27-64.039-40.938 28.598-19.394 47.426-52.16 47.426-89.238C363.754 132.34 315.414 84 256 84s-107.754 48.34-107.754 107.754c0 37.098 18.844 69.875 47.465 89.266-21.887 7.976-42.14 20.308-59.566 36.542-25.235 23.5-42.758 53.465-50.883 86.348C50.852 364.242 30 312.512 30 256 30 131.383 131.383 30 256 30s226 101.383 226 226c0 56.523-20.86 108.266-55.281 147.934zm0 0"
            data-original="#000000"
          ></path>
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center w-full h-full z-50 bg-[#35343494] bg-opacity-50"
          aria-hidden={!isOpen}
        >
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="my-4 text-center relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 fill-red-500 inline"
                viewBox="0 0 24 24"
              >
                <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
              </svg>
              <h4 className="text-gray-800 text-base font-semibold mt-4 text-wrap">
                {`Are you sure you want to change the user password ${username}?`}
              </h4>

              {/* Buttons */}
              <div className="text-center space-x-4 mt-8">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-white text-sm bg-[#0c172b] hover:bg-[#0c172bea]"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-white text-sm bg-red-600 hover:bg-red-700"
                  onClick={resetPasswords}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePasswordModal;
