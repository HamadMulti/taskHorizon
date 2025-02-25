import { useProjects } from "../../../../hooks/useProjects";
import SkeletonTable from "../../../components/loaders/SkeletonTable";
import PreviewProjectModal from "../../../components/modals/project/preview";
import Pagination from "../../../components/pagination/pagination";
import { useState } from "react";
import { truncateText } from "../../../../utils/truncate";

interface MyProject {
  id: number;
  name: string;
  description: string;
}

const MyProject = () => {
  const {
    my_projects,
    loading,
    my_currentPage,
    my_totalPages,
    my_totalProjects
  } = useProjects();
  const [page, setCurrentPage] = useState(my_currentPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<MyProject>();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 whitespace-nowrap">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-white">
                Name
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Description
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Actions
              </th>
            </tr>
          </thead>
          {loading && !my_projects ? (
            <>
              <SkeletonTable count={5} />
            </>
          ) : (
            <>
              {my_projects.length === 0 ? (
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
                      Project Not Found
                    </span>
                  </tr>
                  <tr className="min-w-full flex justify-center py-6 items-center flex-col">
                    <span> </span>{" "}
                  </tr>
                </tbody>
              ) : (
                <tbody className="whitespace-nowrap">
                  {my_projects.map((project) => (
                    <tr className="even:bg-yellow-50" key={project.id}>
                      <td className="p-4 text-sm text-black">{project.name}</td>
                      <td className="p-4 text-sm text-black">
                        {truncateText(project.description, 30)}
                        <span
                          className="text-yellow-500 font-lighter cursor-pointer"
                          onClick={() => {
                            setIsModalOpen(true);
                            setSelectedProject(project);
                          }}
                        >
                          ...view for more details
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          className="mr-4"
                          title="View"
                          onClick={() => {
                            setIsModalOpen(true);
                            setSelectedProject(project);
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
                        {isModalOpen && selectedProject && (
                          <PreviewProjectModal
                            project={selectedProject}
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
          <span className="text-gray-500">Total Pages | {my_totalPages}</span>
          <Pagination
            currentPage={page}
            totalPages={my_totalPages}
            onPageChange={setCurrentPage}
          />
          <span className="text-gray-500">
            {my_totalProjects} | Number Of Items
          </span>
        </div>
      </div>
    </>
  );
};

export default MyProject;
