import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Marketplace = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8">
            <div className="bg-purple-100 p-6 rounded-full mb-6">
                <ShoppingBag size={48} className="text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
            <p className="text-gray-500 max-w-md">
                Browse and purchase premium templates and resources. This feature is coming soon!
            </p>
        </div>
    );
}

export default Marketplace;
