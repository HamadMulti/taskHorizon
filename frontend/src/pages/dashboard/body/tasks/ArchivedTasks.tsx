import SkeletonTable from "../../../components/loaders/SkeletonTable";
import Pagination from "../../../components/pagination/pagination";
import { useState } from "react";
import { truncateText } from "../../../../utils/truncate";
import { useTasks } from "../../../../hooks/useTasks";
import PreviewTaskModal from "../../../components/modals/task/preview";
import { Task } from "../../../../features/taskSlice";
import RestoreTaskModal from "../../../components/modals/task/restore";
import { useAuth } from "../../../../hooks/useAuth";

const ArchivedTasks = () => {
  const {
    archived_tasks,
    loading,
    archived_currentPage,
    archived_totalPages,
    archived_totalTasks
  } = useTasks();
  const [page, setCurrentPage] = useState(archived_currentPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();
  const { role } = useAuth();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 whitespace-nowrap">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-white">
                Title
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Status
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Description
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Assigned
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Actions
              </th>
            </tr>
          </thead>
          {loading && !archived_tasks ? (
            <SkeletonTable count={5} />
          ) : archived_tasks.length === 0 ? (
            <tbody className="whitespace-nowrap flex">
              <tr className="min-w-full flex justify-center py-6 items-center flex-col">
                {" "}
              </tr>
              <tr className="w-full flex justify-center py-6 items-center flex-col">
                {" "}
              </tr>
              <tr className="min-w-full flex justify-center items-center gap-2.5 py-6 flex-col">
                <img src="/images/warnings/not-found.svg" className="w-12" />
                <span className="text-yellow-600 font-bold">
                  Tasks Not Found
                </span>
              </tr>
              <tr className="min-w-full flex justify-center py-6 items-center flex-col">
                {" "}
              </tr>
              <tr className="min-w-full flex justify-center py-6 items-center flex-col">
                {" "}
              </tr>
            </tbody>
          ) : (
            <tbody className="whitespace-nowrap">
              {archived_tasks.map((task) => (
                <tr className="even:bg-yellow-50" key={task.id}>
                  <td className="p-4 text-sm text-black">{task.title}</td>
                  <td className="p-4 text-sm text-black">{task.status}</td>
                  <td className="p-4 text-sm text-black">
                    {task.description && task.description.length > 0 ? (
                      <>
                        {truncateText(task.description, 30)}
                        <span
                          className="text-yellow-500 font-lighter cursor-pointer"
                          onClick={() => {
                            setIsModalOpen(true);
                            setSelectedTask(task);
                          }}
                        >
                          ...view more
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-yellow-500 font-lighter cursor-pointer"></span>
                      </>
                    )}
                  </td>
                  <td className="p-4 text-sm text-black">{task.assigned_to}</td>
                  <td className="p-4">
                    <button
                      className="mr-4"
                      title="View"
                      onClick={() => {
                        setIsModalOpen(true);
                        setSelectedTask(task);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        fill="currentColor"
                        className="w-6 fill-yellow-500 hover:fill-yellow-700"
                        viewBox="0 0 64 64"
                      >
                        <path d="M31.991 48.248c-.452 0-.905-.012-1.36-.036-9.677-.516-18.492-6.558-22.456-15.394a2 2 0 1 1 3.65-1.637c3.357 7.482 10.822 12.6 19.019 13.036 9.046.485 17.617-4.758 21.332-13.036a2 2 0 0 1 3.65 1.637c-4.201 9.361-13.661 15.43-23.835 15.43z" />
                        <path d="M9.999 34.001a2 2 0 0 1-1.824-2.82c4.387-9.776 14.515-15.958 25.194-15.394 9.677.516 18.492 6.558 22.456 15.394a2 2 0 1 1-3.65 1.637c-3.357-7.482-10.822-12.6-19.019-13.036-9.042-.483-17.617 4.758-21.332 13.036a1.997 1.997 0 0 1-1.825 1.183z" />
                        <path d="M32 40.242c-4.545 0-8.243-3.697-8.243-8.242s3.698-8.242 8.243-8.242 8.243 3.697 8.243 8.242-3.698 8.242-8.243 8.242zm0-12.484c-2.3 0-4.243 1.942-4.243 4.242S29.7 36.242 32 36.242 36.243 34.3 36.243 32 34.3 27.758 32 27.758z" />
                      </svg>
                    </button>
                    {isModalOpen && selectedTask && (
                      <PreviewTaskModal
                        task={selectedTask}
                        onClose={() => setIsModalOpen(false)}
                      />
                    )}
                    {role === "admin" || role === "team_leader" ? (
                      <>
                        <RestoreTaskModal id={task.id} title={task.title} />
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        <div className="flex justify-between py-4 px-6">
          <span className="text-gray-500">
            Total Pages | {archived_totalPages}
          </span>
          <Pagination
            currentPage={page}
            totalPages={archived_totalPages}
            onPageChange={setCurrentPage}
          />
          <span className="text-gray-500">
            {archived_totalTasks} | Number Of Items
          </span>
        </div>
      </div>
    </>
  );
};

export default ArchivedTasks;
