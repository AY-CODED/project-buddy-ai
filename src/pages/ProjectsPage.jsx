import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ActiveProjects from "./ActiveProjects";
import NewProject from "./NewProject";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Sample Business Project",
      category: "Business",
      type: "Plan",
      progress: 50,
      status: "In Progress",
      lastEdited: "Just now",
      tags: ["Business", "Plan"],
    },
    {
      id: 2,
      title: "Sample Academic Project",
      category: "Academic",
      type: "Essay",
      progress: 100,
      status: "Completed",
      lastEdited: "Yesterday",
      tags: ["Essay", "Word Doc"],
    },
  ]);

  // Handler to add a new project
  const addProject = (newProject) => {
    const id = projects.length + 1;
    setProjects([...projects, { id, ...newProject }]);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ActiveProjects projects={projects} />}
        />
        <Route
          path="/new-project"
          element={<NewProject addProject={addProject} />}
        />
      </Routes>
    </Router>
  );
};

export default ProjectsPage;
