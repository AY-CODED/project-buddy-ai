import React, { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom'; // 1. Import useOutletContext
import { ArrowLeft, Calendar, Layout, Type } from 'lucide-react';

const NewProject = () => { // 2. Remove 'onAddProject' prop
  // 3. Get the function from Layout context
  const { addProject } = useOutletContext(); 
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Business',
    description: '',
    deadline: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 4. Use the function from context
    addProject(formData); 
    navigate('/');
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Back Navigation */}
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
            <p className="text-gray-500 mt-2">Fill in the details below to initialize a new workflow.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Project Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Type size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Q4 Marketing Strategy"
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Layout size={18} className="text-gray-400" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all duration-200 outline-none text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="Business">Business</option>
                  <option value="Academic">Academic</option>
                </select>
                {/* Custom Chevron */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Deadline Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Deadline</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="deadline"
                  required
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all duration-200 outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe the goals of this project..."
                className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Project
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProject;