import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star, Download, Search } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const Marketplace = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMarketplace = async () => {
            const q = query(collection(db, "marketplace"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };
        fetchMarketplace();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ShoppingBag className="text-purple-600" /> Marketplace
                    </h1>
                    <p className="text-gray-500">Premium AI structures for Nigerian Students & Businesses</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search templates..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                        <div className="h-32 bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                {item.type || 'Template'}
                            </span>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{item.title}</h3>
                            <div className="flex items-center gap-1 mt-1 mb-4">
                                <Star size={14} className="text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-400">(4.8)</span>
                            </div>
                            <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
                                <Download size={16} /> Get for Free
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Marketplace;