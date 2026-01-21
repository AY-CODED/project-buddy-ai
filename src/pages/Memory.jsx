import React, { useEffect, useState } from 'react';
import { BrainCircuit, Loader2, Trash2, Eye } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Memory = () => {
    const { currentUser } = useAuth();
    const [savedMemories, setSavedMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, `users/${currentUser.uid}/memories`));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSavedMemories(data);
            } catch (err) {
                console.error("Error fetching memories:", err);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser) fetchMemories();
    }, [currentUser]);

    const deleteMemory = async (id) => {
        await deleteDoc(doc(db, `users/${currentUser.uid}/memories`, id));
        setSavedMemories(prev => prev.filter(m => m.id !== id));
    };

    if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-100 p-3 rounded-xl"><BrainCircuit className="text-blue-600" /></div>
                <h1 className="text-3xl font-bold text-gray-900">Your Memory Bank</h1>
            </div>

            {savedMemories.length === 0 ? (
                <p className="text-gray-500 text-center py-20">You haven't saved any templates yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedMemories.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-3 mb-4">{item.content}</p>
                            <div className="flex justify-between items-center border-t pt-4">
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.category}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => deleteMemory(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Memory;