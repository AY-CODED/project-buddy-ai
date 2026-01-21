import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

const Layouts = () => {
    // State for Mobile Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { currentUser } = useAuth();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            setProjects([]);
            return;
        }

        const q = query(
            collection(db, 'projects'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProjects(projectsData);
        }, (error) => {
             console.error("Error fetching projects: ", error);
             // Fallback if index is missing or other error (e.g. just remove orderBy temporarily if needed, but desc sort is standard)
             // If query fails, we might see it in console.
        });

        return () => unsubscribe();
    }, [currentUser]);

    const addProject = async (newProjectData) => {
        if (!currentUser) return;

        const now = new Date();
        const formattedTime = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });

        // We don't need the client-side ID, Firestore creates one.
        // But NewProject passes it. We can ignore it or store it as 'tempId' if we want.
        const { id, ...projectData } = newProjectData;

        const newProject = {
            ...projectData,
            userId: currentUser.uid,
            lastEdited: "Just now", 
            timestamp: formattedTime,
            createdAt: serverTimestamp(),
            tags: [newProjectData.category],
            type: newProjectData.category
        };

        try {
            const docRef = await addDoc(collection(db, 'projects'), newProject);
            // Return the new project with the real ID
            return { id: docRef.id, ...newProject };
        } catch (error) {
            console.error("Error adding project: ", error);
            throw error;
        }
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