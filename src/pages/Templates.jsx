import React from 'react';
import { FileText } from 'lucide-react';

const Templates = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8">
            <div className="bg-green-100 p-6 rounded-full mb-6">
                <FileText size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates</h1>
            <p className="text-gray-500 max-w-md">
                A library of ready-to-use templates for your projects will be available here soon.
            </p>
        </div>
    );
}

export default Templates;
