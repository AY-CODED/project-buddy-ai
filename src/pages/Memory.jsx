import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Memory = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8">
            <div className="bg-blue-100 p-6 rounded-full mb-6">
                <BrainCircuit size={48} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Memory</h1>
            <p className="text-gray-500 max-w-md">
                Your personalized AI knowledge base is under construction. Stay tuned!
            </p>
        </div>
    );
}

export default Memory;
