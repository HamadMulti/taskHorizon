import { useState } from "react";
import { useProjects } from "../../../hooks/useProjects";

interface Props {
  onSelect: (selectedProject: string) => void;
}

const ProjectDropdown: React.FC<Props> = ({ onSelect }) => {
  const { my_projects, loading, error, fetchMyProjectSelector } = useProjects();
  const [selectedProject, setSelectedProject] = useState("");

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <div>
      <select
        value={selectedProject}
        onChange={handleSelect}
        onClick={fetchMyProjectSelector}
        className="px-4 py-3 bg-gray-100 w-full text-gray-800 text-sm border-none focus:outline-yellow-600 focus:bg-transparent rounded-lg"
      >
        <option value="">Select a project</option>
        {loading ? (
          <option disabled>Loading...</option>
        ) : error ? (
          <option disabled>{error}</option>
        ) : (
          my_projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default ProjectDropdown;
