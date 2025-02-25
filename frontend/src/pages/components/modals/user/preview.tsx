import capitalizeUsername from "../../../../utils/capitalize";

interface Users {
  id: number;
  username: string;
  email: string;
}

interface PreviewUsersModalProps {
  user?: Users;
  onClose: () => void;
}

const PreviewUserModal: React.FC<PreviewUsersModalProps> = ({
  user,
  onClose
}) => {
  return (
    <div
      className="fixed inset-0 p-4 flex justify-center items-start w-full h-full z-50 bg-[#35343494] bg-opacity-50 pt-20"
      aria-hidden={!user}
    >
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 relative">
        {/* Header Section */}
        <div className="flex items-start border-b border-gray-300 pb-4">
          <div className="flex-1">
            <h3 className="text-yellow-600 text-xl font-bold">
              User Preview
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Detailed view of the selected user.
            </p>
          </div>

          {/* Close Button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 ml-2 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500"
            viewBox="0 0 320.591 320.591"
            onClick={onClose}
          >
            <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"></path>
            <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"></path>
          </svg>
        </div>

        {/* Project Details */}
        <div className="my-8 relative">
          <ul className="text-gray-800 space-y-4">
            <li className="flex flex-wrap justify-start gap-4 text-sm">
              <span className="">
                <img
                  src={`https://ui-avatars.com/api/?format=svg&name=${user?.username}}&bold=true&background=random&length=1&rounded=true`}
                  alt="profile-pic"
                  className="w-9 h-9 max-lg:w-16 max-lg:h-16 rounded-full border-2 border-gray-300 cursor-pointer"
                />
              </span>
            </li>
            <li className="flex flex-wrap gap-4 text-sm">
              <div className="flex flex-col relative">
                <span>
                  <strong>Name</strong>
                </span>
                <span className="text-warp">{capitalizeUsername(user?.username ?? "")}</span>
              </div>
            </li>
            <li className="flex flex-col items-start flex-wrap gap-4 text-sm">
              <div className="flex flex-col relative">
                <span>
                  <strong>Email</strong>
                </span>
                <p className="text-wrap">{user?.email}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex max-sm:flex-col items-center gap-4 mt-8">
          <button
            type="button"
            className="text-sm px-4 py-2.5 w-full tracking-wide bg-[#0c172b] hover:bg-[#0c172bea] text-white border border-gray-300 rounded-lg max-sm:order-1"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewUserModal;
