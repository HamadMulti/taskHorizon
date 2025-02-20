import { useState } from "react";

interface CreateTaskModalProps {
  onSave: (newTask: Task) => void;
  onClose: () => void;
}

interface Task {
  id: number;
  title: string;
  status: string;
  assigned_to: string;
  description?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [assignedTo, setAssignedTo] = useState("");
  const [description, setDescription] = useState("");

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
            <h3 className="text-yellow-600 text-xl font-bold mb-4">Create New Task</h3>

            {/* Form */}
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const newTask: Task = {
                  id: Date.now(),
                  title,
                  status,
                  assigned_to: assignedTo,
                  description,
                };
                onSave(newTask);
                setIsOpen(false);
              }}
            >
              {/* Title Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Task Title</label>
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
                <label className="text-gray-800 text-sm mb-2 block">Status</label>
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
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Assigned To</label>
                <input
                  type="text"
                  placeholder="Enter assigned person"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="px-4 py-3 bg-gray-100 w-full text-gray-800 text-sm border-none focus:outline-yellow-600 focus:bg-transparent rounded-lg"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Description</label>
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
                  Create Task
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
