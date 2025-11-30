import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  Plus, 
  MoreHorizontal, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  ArrowRight 
} from 'lucide-react';

const ActiveProjects = () => {
  // Fix: Handle null context if useOutletContext returns null
  const { projects } = useOutletContext() || {}; 

  const [activeTab, setActiveTab] = useState('All Projects');

  const tabs = ['All Projects', 'Business', 'Academic'];

  // Safety check: ensure projects exists before filtering
  const safeProjects = projects || [];

  const filteredProjects = activeTab === 'All Projects' 
    ? safeProjects 
    : safeProjects.filter(p => p.category === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Projects</h1>
          <p className="text-gray-500 mt-1">Manage your ongoing tasks and deadlines</p>
        </div>
        
        {/* Tabs */}
        <div className="mt-4 md:mt-0 bg-white p-1 rounded-xl border border-gray-200 inline-flex shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Create New Project Card - Always First */}
        <Link 
          to="/new-project"
          className="group relative flex flex-col items-center justify-center h-full min-h-[300px] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-500 transition-all duration-300 cursor-pointer"
        >
          <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">Create New Project</h3>
          <p className="text-sm text-gray-500 mt-1">Start a new workflow</p>
        </Link>

        {/* Project Cards */}
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full min-h-[300px]">
            
            {/* Card Header */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  project.category === 'Business' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {project.category === 'Business' ? <Briefcase size={24} /> : <GraduationCap size={24} />}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{project.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{project.category}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags && project.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer / Progress */}
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-medium text-gray-700">Progress</span>
                <span className={`${project.progress === 100 ? 'text-green-600' : 'text-blue-600'} font-bold`}>
                  {project.progress}%
                </span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    project.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={14} className="mr-1" />
                  {project.lastEdited}
                </div>

                {/* ✅ UPDATED LINK: Navigate to Result Page with Project Data */}
                <Link 
                  to="/project-result" 
                  state={{ project: project }}
                  className="group flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Continue
                  <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveProjects;