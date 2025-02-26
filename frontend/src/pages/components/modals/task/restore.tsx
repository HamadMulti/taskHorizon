import { useState } from "react";
import { useTasks } from "../../../../hooks/useTasks";

interface DeleteModalProps {
  id: number;
  title: string;
}

const RestoreTaskModal: React.FC<DeleteModalProps> = ({ id, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { restoreTaskById } = useTasks();

  const Restore = () => {
    restoreTaskById(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Restore Button to Open Modal */}
      <button className="mr-4" title="Delete" onClick={() => setIsOpen(true)}>
        <svg
          width="20"
          viewBox="0 0 48 48"
          className="w-5 fill-green-500 hover:fill-green-700"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h48v48h-48z" fill="none" />
          <path d="M25.99 6c-9.95 0-17.99 8.06-17.99 18h-6l7.79 7.79.14.29 8.07-8.08h-6c0-7.73 6.27-14 14-14s14 6.27 14 14-6.27 14-14 14c-3.87 0-7.36-1.58-9.89-4.11l-2.83 2.83c3.25 3.26 7.74 5.28 12.71 5.28 9.95 0 18.01-8.06 18.01-18s-8.06-18-18.01-18zm-1.99 10v10l8.56 5.08 1.44-2.43-7-4.15v-8.5h-3z" />
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
                {`Are you sure you want to restore ${title}?`}
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
                  className="px-4 py-2 rounded-lg text-white text-sm bg-green-600 hover:bg-green-700"
                  onClick={Restore}
                >
                  Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestoreTaskModal;
