import { useState, useEffect } from "react";
import { useProjects } from "../../../hooks/useProjects";

interface Props {
  onSelect: (selectedProject: string) => void;
  selectedValue?: number;
}

const ProjectDropdown: React.FC<Props> = ({ onSelect, selectedValue }) => {
  const { my_projects, loading, error, fetchMyProjectSelector } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string>(
    selectedValue?.toString() ?? ""
  );

  useEffect(() => {
    fetchMyProjectSelector();
  }, [fetchMyProjectSelector]);

  useEffect(() => {
    if (selectedValue !== undefined) {
      setSelectedProject(selectedValue.toString());
    }
  }, [selectedValue]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedProject(newValue);
    onSelect(newValue);
  };

  return (
    <div>
      <select
        value={selectedProject}
        required
        onChange={handleSelect}
        className="px-4 py-3 bg-gray-100 w-full text-gray-800 text-sm border-none focus:outline-yellow-600 focus:bg-transparent rounded-lg"
      >
        <option value="">Select a project</option>
        {loading ? (
          <option disabled>Loading...</option>
        ) : error ? (
          <option disabled>{error}</option>
        ) : (
          my_projects.map((project) => (
            <option key={project.id} value={project.id.toString()}>
              {project.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default ProjectDropdown;
