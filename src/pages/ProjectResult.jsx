import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, FileText, BookOpen, Edit, Save, X, Loader2, MessageCircle, Send, Minus } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { chatWithCohere } from '../services/cohere';

const ProjectResult = () => {
  const location = useLocation();
  const { id } = useParams();

  // Initialize from state if available, otherwise null (will fetch)
  const [project, setProject] = useState(location.state?.project || null);
  const [isLoading, setIsLoading] = useState(!location.state?.project && !!id);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit state
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // If we have an ID but no project data, fetch it.
    if (id && !project) {
        const fetchProject = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'projects', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProject({ id: docSnap.id, ...data });
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProject();
    }
  }, [id, project]);

  // Sync edit state and chat history when project is loaded
  useEffect(() => {
      if (project) {
          setEditTitle(project.title);
          setEditContent(project.content);
          if (project.chatHistory) {
              setChatHistory(project.chatHistory);
          }
      }
  }, [project]); // Keep this simple, separate edit mode toggle sync if needed

  // Sync content when entering edit mode, if distinct from above
  useEffect(() => {
    if (isEditing && project) {
       setEditContent(project.content);
       setEditTitle(project.title);
    }
  }, [isEditing]);

  // Auto-scroll chat
  useEffect(() => {
      if (isChatOpen && chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [chatHistory, isChatOpen]);


  const handleSave = async () => {
      if (!project || !project.id) return;
      setIsSaving(true);
      try {
          const docRef = doc(db, 'projects', project.id);
          await updateDoc(docRef, {
              title: editTitle,
              content: editContent,
              lastEdited: "Just now" // In a real app, use serverTimestamp() or new Date().toISOString()
          });

          setProject(prev => ({
              ...prev,
              title: editTitle,
              content: editContent,
              lastEdited: "Just now"
          }));
          setIsEditing(false);
      } catch (error) {
          console.error("Error updating project:", error);
          alert("Failed to save changes.");
      } finally {
          setIsSaving(false);
      }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || !project) return;

    const userMsg = { role: 'user', message: chatInput };
    // Optimistic update
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setChatInput('');
    setIsChatLoading(true);

    try {
        // Use current content (edited or saved) as context
        const currentContent = isEditing ? editContent : project.content;

        // Pass current history (excluding the new message) to API
        const response = await chatWithCohere(currentContent, chatHistory, userMsg.message);

        const aiMsg = { role: 'model', message: response };
        const updatedHistory = [...newHistory, aiMsg];

        setChatHistory(updatedHistory);

        // Persist chat history silently
        if (project.id) {
            const docRef = doc(db, 'projects', project.id);
            await updateDoc(docRef, {
                chatHistory: updatedHistory
            });
        }

    } catch (error) {
        console.error("Chat error:", error);
        setChatHistory(prev => [...prev, { role: 'model', message: "Sorry, I encountered an error. Please try again." }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleDownloadWord = () => {
    const element = document.getElementById('project-content');
    if (!element) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${project.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; }
          h1 { text-align: center; font-size: 24pt; font-weight: bold; margin-bottom: 24px; text-transform: capitalize; }
          .header { text-align: center; border-bottom: 1px solid #000; margin-bottom: 30px; padding-bottom: 20px; }
          .meta { font-size: 10pt; color: #555; text-align: center; margin-bottom: 10px; }
          .content { text-align: justify; white-space: pre-wrap; }
          .footer { margin-top: 50px; font-size: 9pt; text-align: center; color: #888; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
           <p style="text-transform: uppercase; font-weight: bold; font-size: 10pt;">Department of ${project.category}</p>
           <h1>${project.title}</h1>
           <div class="meta">
             <p><strong>Student Name:</strong> Student Name | <strong>Matric:</strong> HNG-102-44</p>
             <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
           </div>
        </div>
        <div class="content">
          ${project.content}
        </div>
        <div class="footer">
          Generated by ProjectBuddy AI
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.replace(/\s+/g, '_')}_Assignment.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-200">
              <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
      );
  }

  if (!project) {
    if (!id) return <Navigate to="/" replace />;
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <p className="text-gray-600">Project not found.</p>
             <Link to="/" className="ml-4 text-blue-600 hover:underline">Go Home</Link>
        </div>
    );
  }

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-200 py-6 md:py-10 px-2 md:px-4 font-sans print:bg-white print:p-0">
      
      {/* --- TOOLBAR --- */}
      <div className="w-full md:max-w-[210mm] mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
       <Link 
  to="/active-projects" 
  className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors self-start md:self-auto"
>
  <ArrowLeft size={16} className="mr-2" />
  Back to Dashboard
</Link>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
             {/* Edit / Save Buttons */}
             {isEditing ? (
                <>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-all font-medium text-xs md:text-sm"
                        disabled={isSaving}
                    >
                        <X size={16} /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition-all font-medium text-xs md:text-sm"
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Changes
                    </button>
                </>
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 shadow-sm transition-all font-medium text-xs md:text-sm"
                >
                    <Edit size={16} /> Edit Document
                </button>
            )}

            <button 
                onClick={handleDownloadWord}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 shadow-sm transition-all font-medium text-xs md:text-sm"
            >
                <FileText size={16} /> <span className="hidden sm:inline">Download as</span> Word
            </button>

            <button 
                onClick={() => window.print()}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium text-xs md:text-sm"
            >
                <Printer size={16} /> Print
            </button>
        </div>
      </div>

      {/* --- THE PAPER DOCUMENT --- */}
      <div id="project-content" className="w-full md:max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-6 md:p-[25mm] relative print:shadow-none print:w-full print:max-w-none print:p-[20mm] print:m-0">
        
        {/* HEADER */}
        <div className="text-center border-b-4 border-double border-gray-800 pb-6 mb-10">
            <div className="flex justify-center mb-4 text-gray-800">
                <BookOpen size={36} md:size={48} strokeWidth={1.5} />
            </div>
            
            <p className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-gray-600 mb-4">
                Department of {project.category === 'Business' ? 'Business Administration' : project.category === 'Academic' ? 'General Studies' : 'Personal Development'}
            </p>
            
            {isEditing ? (
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-center text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight font-serif capitalize border-b-2 border-blue-300 focus:outline-none focus:border-blue-600 bg-gray-50 p-2 rounded"
                />
            ) : (
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight font-serif capitalize">
                    {project.title}
                </h1>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-8 border-t border-gray-200 pt-6">
                <div className="text-center">
                    <p className="font-bold uppercase tracking-wider text-[10px] text-gray-500 mb-1">Submitted By</p>
                    <div className="font-serif text-gray-900 text-base">Student Name</div>
                </div>
                
                <div className="text-center border-t sm:border-t-0 sm:border-l sm:border-r border-gray-200 pt-4 sm:pt-0">
                    <p className="font-bold uppercase tracking-wider text-[10px] text-gray-500 mb-1">Matric Number</p>
                    <div className="font-serif text-gray-900 text-base">HNG-102-44</div>
                </div>

                <div className="text-center border-t sm:border-t-0 border-gray-200 pt-4 sm:pt-0">
                     <p className="font-bold uppercase tracking-wider text-[10px] text-gray-500 mb-1">Date</p>
                     <div className="font-serif text-gray-900 text-base">{formattedDate}</div>
                </div>
            </div>
        </div>

        {/* BODY */}
        <div className="prose prose-lg max-w-none">
             {isEditing ? (
                 <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-h-[500px] whitespace-pre-wrap font-serif text-gray-900 leading-loose text-justify text-base md:text-lg border-2 border-blue-300 focus:outline-none focus:border-blue-600 bg-gray-50 p-4 rounded resize-y"
                 />
             ) : (
                <div className="whitespace-pre-wrap font-serif text-gray-900 leading-loose text-justify text-base md:text-lg">
                    {project.content}
                </div>
             )}
        </div>

        {/* FOOTER */}
        <div className="mt-20 pt-6 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-400 font-sans uppercase tracking-widest gap-2 print:fixed print:bottom-10 print:left-0 print:w-full print:px-[20mm]">
            <span>ProjectBuddy AI Generation</span>
            <span>Official Submission Document</span>
        </div>

      </div>

      {/* --- CHAT INTERFACE --- */}
      {/* Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 print:hidden"
      >
        {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50 print:hidden overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Project Assistant</h3>
                <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <Minus size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatHistory.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        Ask me anything about your project!
                    </div>
                )}
                {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                            msg.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                        }`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
                {isChatLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                            <Loader2 className="animate-spin text-blue-600" size={16} />
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                    onClick={handleSendChat}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProjectResult;
