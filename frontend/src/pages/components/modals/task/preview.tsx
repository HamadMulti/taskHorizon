import { Task } from "../../../../features/taskSlice";


interface PreviewTaskModalProps {
  task?: Task;
  onClose: () => void;
}

const PreviewTaskModal: React.FC<PreviewTaskModalProps> = ({
  task,
  onClose
}) => {
  return (
    <div
      className="fixed inset-0 p-4 flex justify-center items-start w-full h-full z-50 bg-[#35343494] bg-opacity-50 pt-20"
      aria-hidden={!task}
    >
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 relative">
        {/* Header Section */}
        <div className="flex items-start border-b border-gray-300 pb-4">
          <div className="flex-1">
            <h3 className="text-gray-800 text-xl font-bold">Task Preview</h3>
            <p className="text-gray-600 text-sm mt-1">
              Detailed view of the selected task.
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

        {/* Task Details */}
        <div className="my-8">
          <ul className="text-gray-800 space-y-4">
            <li className="flex flex-wrap gap-4 text-sm">
              <strong>Title:</strong>
              <span className="ml-auto">{task?.title}</span>
            </li>
            <li className="flex flex-wrap gap-4 text-sm">
              <strong>Status:</strong>
              <span className="ml-auto">{task?.status}</span>
            </li>
            <li className="flex flex-wrap gap-4 text-sm">
              <strong>Priority:</strong>
              <span className="ml-auto">{task?.priority}</span>
            </li>
            <li className="flex flex-wrap gap-4 text-sm">
              <strong>Assigned To:</strong>
              <span className="ml-auto">{task?.assigned_to}</span>
            </li>
            <li className="flex flex-wrap gap-4 text-sm">
              <strong>Description:</strong>
              <span className="ml-auto">{task?.description}</span>
            </li>
            <li className="flex flex-wrap gap-4 text-sm">
              <strong>Due Date:</strong>
              <span className="ml-auto">{task?.due_date ? task.due_date.toLocaleDateString() : null}</span>
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

export default PreviewTaskModal;
