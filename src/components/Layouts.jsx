import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layouts = () => {
    // 1. Lift State Here
    const [projects, setProjects] = useState([
        { id: 1, title: "Marketing Campaign Q4", category: "Business", tags: ["Marketing"], progress: 75, status: "In Progress", lastEdited: "2 hours ago", deadline: "2023-12-01" },
        { id: 2, title: "Thesis Research", category: "Academic", tags: ["Research"], progress: 30, status: "In Progress", lastEdited: "1 day ago", deadline: "2024-01-15" }
    ]);

    // 2. Define Handler Here
    const addProject = (newProjectData) => {
        const newProject = {
            id: projects.length + 1,
            ...newProjectData,
            progress: 0,
            status: "Not started",
            lastEdited: "Just now",
            tags: [newProjectData.category],
            type: newProjectData.category
        };
        setProjects([newProject, ...projects]);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-8">
                    {/* 3. Pass data to children via context */}
                    <Outlet context={{ projects, addProject }} /> 
                </main>
            </div>
        </div>
    );
};

export default Layouts;