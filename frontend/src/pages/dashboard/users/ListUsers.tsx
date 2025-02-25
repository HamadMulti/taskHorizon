import { useState } from "react";
import { useUsers } from "../../../hooks/useUsers";
import Pagination from "../../components/pagination/pagination";
import SkeletonTable from "../../components/loaders/SkeletonTable";
import PreviewUserModal from "../../components/modals/user/preview";
import capitalizeUsername from "../../../utils/capitalize";
import CreateUserModal from "../../components/modals/user/create";
import { useLocation } from "react-router-dom";

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
                  <tr className="min-w-full flex justify-center py-6 items-center flex-col">
                    {" "}
                  </tr>
                  <tr className="min-w-full flex justify-center gap-2.5 py-6 items-start flex-col">
                    <img
                      src="/images/warnings/not-found.svg"
                      className="w-12"
                    />
                    <span className="text-yellow-600 font-bold">
                      Users Not Found
                    </span>
                  </tr>
                  <tr className="min-w-full flex justify-center py-6 items-center flex-col">
                    <span> </span>{" "}
                  </tr>
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
                            className="w-5 fill-yellow-500 hover:fill-yellow-700"
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
