import { useState } from "react";
import { useTasks } from "../../../../hooks/useTasks";
import UserDropdown from "../../dropdowns/UserSelector";
import ProjectDropdown from "../../dropdowns/ProjectSelector";
import { useAuth } from "../../../../hooks/useAuth";

interface CreateTaskModalProps {
  onClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [description, setDescription] = useState("");
  const { addTask, loading } = useTasks();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const { role } = useAuth();

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
  };
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: title || "",
      status: status || "",
      assigned_to: selectedUser || "",
      description,
      project_id: Number(selectedProject)
    };
    if (!!title && !!selectedProject) {
      await addTask(data);
      setIsOpen(false);
      setTitle("");
      onClose();
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
              Create New Task
            </h3>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleCreate}>
              {/* Title Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Title
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
                  <option value="in_progress">In Progress</option>
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
                      <UserDropdown onSelect={handleUserSelect} />
                    </div>
                  </div>
                </>
              ) : null}
              {/* Project Id To Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Project
                </label>
                <div>
                  <ProjectDropdown onSelect={setSelectedProject} />
                </div>
              </div>

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
                  {loading ? (
                    <>
                      Loading
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18px"
                        fill="#fff"
                        className="ml-2 inline animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z" />
                      </svg>
                    </>
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTaskModal;
