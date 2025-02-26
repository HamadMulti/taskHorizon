import { useState } from "react";
import { useTasks } from "../../../../hooks/useTasks";
import { useAuth } from "../../../../hooks/useAuth";
import UserDropdown from "../../dropdowns/UserSelector";
import ProjectDropdown from "../../dropdowns/ProjectSelector";

interface EditTaskModalProps {
  task: {
    id: number;
    title: string;
    status: string;
    assigned_to?: string;
    description: string;
    project_id: number;
  };
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { role } = useAuth();
  const [title, setTitle] = useState(task?.title);
  const [status, setStatus] = useState(task?.status);
  const [description, setDescription] = useState(task?.description || "");
  const { project_id, id } = task;
  const { editTask } = useTasks();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = (e: any) => {
    e.preventDefault();
    const data = {
      id,
      title: title || "",
      status: status || "",
      assigned_to: selectedUser,
      description,
      project_id: Number(selectedProject)
    };
    editTask(data);
    setIsOpen(false);
    onClose();
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
              Edit Task
            </h3>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleUpdate}>
              {/* Title Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-3 bg-gray-100 w-full text-gray-800 text-sm border-none focus:outline-yellow-600 focus:bg-transparent rounded-lg"
                />
              </div>

              {/* Status Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-100 w-full text-gray-800 text-sm border-none focus:outline-yellow-600 focus:bg-transparent rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="In progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Assigned To Input */}
              {role === "admin" || role === "team_leader" ? (
                <>
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                      Assigned To
                    </label>
                    <div>
                      <UserDropdown selectedValue={task.assigned_to ?? ""} onSelect={handleUserSelect} />
                    </div>
                  </div>

                  {/* Project Id To Input */}
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                      Project
                    </label>
                    <div>
                      <ProjectDropdown selectedValue={project_id ?? ""} onSelect={setSelectedProject} />
                    </div>
                  </div>
                </>
              ) : null}

              {/* Description Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Description
                </label>
                <textarea
                  placeholder="Enter task description"
                  value={description}
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-3 bg-gray-100 w-full text-gray-800 text-sm border-none focus:outline-yellow-600 focus:bg-transparent rounded-lg"
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
                  className="px-6 py-3 rounded-lg text-white text-sm bg-yellow-600 hover:bg-yellow-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditTaskModal;
