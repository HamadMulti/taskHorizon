import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { fetchProjects, updateProject, deleteProject } from "../features/projectSlice";
import { Link } from "react-router-dom";

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const [editProject, setEditProject] = useState<{ id: number; name: string; description: string } | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editProject) {
      await dispatch(updateProject(editProject));
      setEditProject(null); // Clear after update
    }
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteProject(id));
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Project List</h2>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <>
          {projects.length > 0 ? (
            <>
              <ul>
                {projects.map((project) => (
                  <li key={project.id} className="p-2 border-b">
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-blue-500"
                    >
                      {project.name}
                    </Link>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 mr-2 rounded"
                      onClick={() => setEditProject({ id: project.id, name: project.name, description: project.description })}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
            <p>No projects found</p>
            <ProjectList />
            </>
          )}
        </>
      )}

      {editProject && (
        <form onSubmit={handleUpdate} className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold">Edit Project</h3>
          <input
            className="block border p-2 w-full mt-2"
            type="text"
            value={editProject.name}
            onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
            required
          />
          <textarea
            className="block border p-2 w-full mt-2"
            value={editProject.description}
            onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 mt-2 rounded">
            Update Project
          </button>
          <button type="button" onClick={() => setEditProject(null)} className="ml-2 text-gray-700">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ProjectList;
