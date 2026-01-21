import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layouts = () => {
    // State for Mobile Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Lift State Here
    const [projects, setProjects] = useState(() => {
        const savedProjects = localStorage.getItem('projects');
        return savedProjects ? JSON.parse(savedProjects) : [];
    });

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    const addProject = (newProjectData) => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });

        const newProject = {
            id: projects.length + 1,
            ...newProjectData,
            lastEdited: "Just now", 
            timestamp: formattedTime,
            tags: [newProjectData.category],
            type: newProjectData.category
        };
        setProjects([newProject, ...projects]);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            
            {/* Mobile Overlay (Click to close sidebar) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Pass props for responsive behavior */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full w-full relative transition-all duration-300">
                {/* Navbar - Pass toggle function */}
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet context={{ projects, addProject }} /> 
                </main>
            </div>
        </div>
    );
};

export default Layouts;