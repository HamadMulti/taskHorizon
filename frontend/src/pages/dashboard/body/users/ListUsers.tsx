import { useState } from "react";
import { useUsers } from "../../../../hooks/useUsers";
import Pagination from "../../../components/pagination/pagination";
import SkeletonTable from "../../../components/loaders/SkeletonTable";
import PreviewUserModal from "../../../components/modals/user/preview";
import capitalizeUsername from "../../../../utils/capitalize";
import CreateUserModal from "../../../components/modals/user/create";
import { useLocation } from "react-router-dom";
import DeleteUserModal from "../../../components/modals/user/delete";
import ChangePasswordModal from "../../../components/modals/user/generatepassword";
import EditUserModal from "../../../components/modals/user/edit";

interface Users {
  id: number;
  username: string;
  email: string;
}

const Users = () => {
  const { users, current_page, pages, total, loading } = useUsers();
  const [page, setCurrentPage] = useState(current_page);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Users>();
  const { pathname } = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const handleClose = () => {
    setIsCreating(false);
    setIsEditing(false);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div
          className={`${
            pathname === "/dashboard/users"
              ? "w-fit absolute z-1000 top-0 max-md:top-9 max-md:right-0 max-sm:top-0 max-sm:right-18 right-20 bg-transparent flex items-center justify-end py-4 px-8"
              : "hidden w-0 content-none clear-none"
          }`}
        >
          <button
            className="flex items-center justify-center p-2 gap-2 rounded text-gray-100 shadow-2xs cursor-pointer bg-[#0c172b] hover:bg-[#0c172bee] "
            title="Add"
            onClick={() => setIsCreating(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-5 fill-gray-100 hover:fill-gray-200"
              viewBox="0 0 24 24"
            >
              <path
                d="M18 2c2.206 0 4 1.794 4 4v12c0 2.206-1.794 4-4 4H6c-2.206 0-4-1.794-4-4V6c0-2.206 1.794-4 4-4zm0-2H6a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h12a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6z"
                data-original="#000000"
              />
              <path
                d="M12 18a1 1 0 0 1-1-1V7a1 1 0 0 1 2 0v10a1 1 0 0 1-1 1z"
                data-original="#000000"
              />
              <path
                d="M6 12a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1z"
                data-original="#000000"
              />
            </svg>
            Add
          </button>
          {isCreating && (
            <CreateUserModal onClose={handleClose} onOpen={isCreating} />
          )}
        </div>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 whitespace-nowrap">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-white">
                Name
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Email
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Actions
              </th>
            </tr>
          </thead>
          {loading && !users ? (
            <>
              <SkeletonTable count={5} />
            </>
          ) : (
            <>
              {users.length === 0 ? (
                <tbody className="whitespace-nowrap flex">
                  <tr className="min-w-full flex justify-center py-6 items-center flex-col"></tr>
                  <tr className="min-w-full flex justify-center gap-2.5 py-6 items-start flex-col">
                    <span className="flex flex-col items-center justify-center">
                      <svg
                        fill="red"
                        height="100px"
                        width="100px"
                        version="1.1"
                        id="Filled_Icons"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 24 24"
                        enable-background="new 0 0 24 24"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g id="Status-Error-Filled">
                            {" "}
                            <path d="M12,0C5.37,0,0,5.37,0,12s5.37,12,12,12s12-5.37,12-12S18.63,0,12,0z M18.38,16.62l-1.77,1.77L12,13.77l-4.62,4.62 l-1.77-1.77L10.23,12L5.62,7.38l1.77-1.77L12,10.23l4.62-4.62l1.77,1.77L13.77,12L18.38,16.62z"></path>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                      <span className="text-yellow-600 font-bold">
                        Project Not Found
                      </span>
                    </span>
                  </tr>
                  <tr className="min-w-full flex justify-center py-6 items-center flex-col"></tr>
                </tbody>
              ) : (
                <tbody className="whitespace-nowrap">
                  {users.map((user) => (
                    <tr className="even:bg-yellow-50" key={user.id}>
                      <td className="p-4 text-sm text-black">
                        <div className="flex justify-start gap-3 items-center">
                          <img
                            src={`https://ui-avatars.com/api/?format=svg&name=${user.username}}&bold=true&background=random&length=1&rounded=true`}
                            alt="profile-pic"
                            className="w-9 h-9 max-lg:w-16 max-lg:h-16 rounded-full border-2 border-gray-300 cursor-pointer"
                          />
                          {capitalizeUsername(user.username)}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-black">{user.email}</td>
                      <td className="p-4">
                        <button
                          className="mr-4"
                          title="View"
                          onClick={() => {
                            setIsModalOpen(true);
                            setSelectedUsers(user);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            fill="currentColor"
                            className="w-5 fill-gray-400 hover:fill-yellow-700"
                            viewBox="0 0 64 64"
                          >
                            <path
                              d="M31.991 48.248c-.452 0-.905-.012-1.36-.036-9.677-.516-18.492-6.558-22.456-15.394a2 2 0 1 1 3.65-1.637c3.357 7.482 10.822 12.6 19.019 13.036 9.046.485 17.617-4.758 21.332-13.036a2 2 0 0 1 3.65 1.637c-4.201 9.361-13.661 15.43-23.835 15.43z"
                              data-original="#000000"
                            ></path>
                            <path
                              d="M9.999 34.001a2 2 0 0 1-1.824-2.82c4.387-9.776 14.515-15.958 25.194-15.394 9.677.516 18.492 6.558 22.456 15.394a2 2 0 1 1-3.65 1.637c-3.357-7.482-10.822-12.6-19.019-13.036-9.042-.483-17.617 4.758-21.332 13.036a1.997 1.997 0 0 1-1.825 1.183z"
                              data-original="#000000"
                            ></path>
                            <path
                              d="M32 40.242c-4.545 0-8.243-3.697-8.243-8.242s3.698-8.242 8.243-8.242 8.243 3.697 8.243 8.242-3.698 8.242-8.243 8.242zm0-12.484c-2.3 0-4.243 1.942-4.243 4.242S29.7 36.242 32 36.242 36.243 34.3 36.243 32 34.3 27.758 32 27.758z"
                              data-original="#000000"
                            ></path>
                          </svg>
                        </button>
                        {isModalOpen && selectedUsers && (
                          <PreviewUserModal
                            user={selectedUsers}
                            onClose={() => {
                              setIsModalOpen(false);
                            }}
                          />
                        )}
                        <button
                          className="mr-4"
                          title="Edit"
                          onClick={() => {
                            setIsEditing(true);
                            setSelectedUsers(user);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 fill-gray-400 hover:fill-yellow-700"
                            viewBox="0 0 348.882 348.882"
                          >
                            <path
                              d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                              data-original="#000000"
                            />
                            <path
                              d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                              data-original="#000000"
                            />
                          </svg>
                        </button>
                        {isEditing && selectedUsers && (
                          <EditUserModal
                            users={selectedUsers}
                            onClose={handleClose}
                          />
                        )}
                        <ChangePasswordModal
                          id={user.id}
                          username={user.username}
                        />
                        <DeleteUserModal
                          id={user.id}
                          username={user.username}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </>
          )}
        </table>
        <div className="flex justify-between py-4 px-6">
          <span className="text-gray-500">Total Pages | {pages}</span>
          <Pagination
            currentPage={page}
            totalPages={pages}
            onPageChange={setCurrentPage}
          />
          <span className="text-gray-500">{total} | Number Of Items</span>
        </div>
      </div>
    </>
  );
};

export default Users;
