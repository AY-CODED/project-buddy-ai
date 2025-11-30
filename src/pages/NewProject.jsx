import React, { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Calendar, Layout, Type, Sparkles, Loader2, AlertCircle } from 'lucide-react';

const NewProject = () => {
  // Defensive check: Ensure addProject exists in the context
  const context = useOutletContext();
  const addProject = context?.addProject || (() => console.error("addProject function missing in Context"));
  
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Business',
    description: '',
    deadline: ''
  });

  // ✅ YOUR COHERE API KEY
  const COHERE_API_KEY = 'N2mvsti4PTxo1MWiPAySpIJVk1oTKTLJ3CGfzFZN'; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWithCohere = async (title, description) => {
    const url = 'https://api.cohere.ai/v1/chat';

    // ✅ UPDATED PROMPT: STRICT "NO MARKDOWN" RULES
    const prompt = `
    You are a university student submitting an assignment.
    Topic: "${title}"
    Details: "${description}"

    Instructions:
    1. Write a high-quality, formal academic response suitable for a lecturer to grade.
    2. **CRITICAL:** Do NOT use Markdown symbols (like #, *, -, or >). 
    3. Do NOT use bolding or italics syntax.
    4. Write in clear paragraphs. Use standard spacing to separate sections.
    5. If listing items, use numbers (1., 2.) or letters (a., b.) followed by a period, not dashes or dots.
    6. Make it look like a standard typed essay or report.
    
    Start writing the assignment immediately.
    `;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Client-Name': 'ReactApp'
        },
        body: JSON.stringify({
          message: prompt,
          model: "command-a-03-2025", 
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Cohere API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.text; 

    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    try {
      if (!COHERE_API_KEY) {
        throw new Error('Cohere API Key is missing.');
      }

      // 1. Call Cohere AI
      const generatedContent = await generateWithCohere(formData.title, formData.description);

      // 2. Create Final Project Object
      const finalProjectData = {
        id: Date.now(),
        ...formData,
        content: generatedContent, // The AI text
        aiGenerated: true,
        progress: 0,
        status: "Not started",
        lastEdited: "Just now",
        tags: [formData.category]
      };

      // 3. Save to Global State (App.jsx)
      addProject(finalProjectData);

      // 4. Navigate to Result Page and show the answer
      navigate('/project-result', { state: { project: finalProjectData } });

    } catch (err) {
      setError(err.message || 'Failed to generate content. Please check your internet connection.');
    } finally {
      setIsGenerating(false);
    }
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
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={12} /> Powered by Cohere
              </span>
            </div>
            <p className="text-gray-500">Fill in the details. The AI will write your assignment for you.</p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center text-sm">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Project/Topic Title</label>
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
                  placeholder="e.g. History of Nigeria"
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
                  <option value="Personal">Personal</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Deadline Input */}
            {/* <div className="space-y-2">
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
            </div> */}

            {/* Description Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Description (Prompt)</label>
              <textarea
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="E.g. Write a comprehensive history of Nigeria..."
                className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full flex items-center justify-center font-bold py-3.5 rounded-xl shadow-lg transition-all duration-200 ${isGenerating
                    ? 'bg-purple-400 cursor-not-allowed text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30 transform hover:-translate-y-0.5'
                  }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Generating Word...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Generate & Create Project
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProject;