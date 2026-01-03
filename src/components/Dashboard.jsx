import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Package, Pill, TrendingUp, LogOut, Search } from "lucide-react";
import toast from "react-hot-toast";

// Import the new component
// Make sure the path matches where you saved the file in Step 2
import AnalyticsDashboard from "../components/AnalyticsDashboard"; 

const Dashboard = ({ shopData, onLogout }) => {
    const [stats, setStats] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Data on Load
    const fetchData = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            
            // 1. Get Stats (Overall numbers for top cards)
            const statsRes = await axios.get(`${API_URL}/api/inventory/stats/${shopData.shop_id}`);
            setStats(statsRes.data);

            // 2. Get Aggregated Inventory (The new Grouped list from backend)
            const invRes = await axios.get(`${API_URL}/api/inventory/view/${shopData.shop_id}`);
            
            // Ensure we set an array, even if API returns null/undefined
            setMedicines(Array.isArray(invRes.data) ? invRes.data : []);
            
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch inventory data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter Search
    // Note: Backend aggregation returns name/brand inside "_id" object
    const filteredMedicines = medicines.filter(med =>
        med._id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med._id.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-deepBlue p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Stock & Analytics</h1>
                    <p className="text-cyan-400">Welcome, {shopData.shop_name}</p>
                </div>
                <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-900/30 text-red-400 rounded-lg transition border border-slate-700">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="max-w-7xl mx-auto">

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Stock Units"
                        value={stats?.totalMedicinesReceived || 0}
                        icon={<Package size={24} />}
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                    />
                    <StatCard
                        title="Total Pills Sold"
                        value={stats?.totalPillsSold || 0}
                        icon={<TrendingUp size={24} />}
                        color="text-green-400"
                        bg="bg-green-500/10"
                    />
                    <StatCard
                        title="Total Pills Remaining"
                        value={stats?.totalPillsRemaining || 0}
                        icon={<Pill size={24} />}
                        color="text-cyan-400"
                        bg="bg-cyan-500/10"
                    />
                </div>

                {/* ANALYTICS GRAPH SECTION */}
                <AnalyticsDashboard shopId={shopData.shop_id} />

                {/* INVENTORY TABLE SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-cardBlue rounded-xl shadow-lg border border-slate-700 overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between gap-4">
                        <h2 className="text-xl font-semibold text-white">Live Inventory Stock</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or brand..."
                                className="bg-slate-900 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 w-full md:w-64"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-textGray uppercase text-sm">
                                <tr>
                                    <th className="p-4">Medicine</th>
                                    <th className="p-4">Brand</th>
                                    <th className="p-4">Next Expiry</th>
                                    <th className="p-4 text-center">Total Strips</th>
                                    <th className="p-4 text-center">Total Pills</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading inventory...</td></tr>
                                ) : filteredMedicines.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No medicines found.</td></tr>
                                ) : (
                                    filteredMedicines.map((med, index) => (
                                        // Using name+brand as key because IDs are grouped now
                                        <tr key={`${med._id.name}-${med._id.brand}`} className="hover:bg-slate-800/50 transition">
                                            
                                            {/* Medicine Name */}
                                            <td className="p-4 font-medium text-white flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                                                    {med._id.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                {med._id.name}
                                            </td>

                                            {/* Brand */}
                                            <td className="p-4 text-textGray">{med._id.brand}</td>

                                            {/* Expiry Date */}
                                            <td className="p-4 text-textGray">
                                                {med.nextExpiry ? new Date(med.nextExpiry).toLocaleDateString() : 'N/A'}
                                            </td>

                                            {/* Total Strips Count */}
                                            <td className="p-4 text-center">
                                                <span className="bg-blue-900/30 text-blue-400 border border-blue-500/20 py-1 px-3 rounded-md text-sm font-semibold">
                                                    {med.totalStrips} Units
                                                </span>
                                            </td>

                                            {/* Total Pills Count */}
                                            <td className="p-4 text-center">
                                                <span className="bg-green-900/30 text-green-400 border border-green-500/20 py-1 px-3 rounded-md text-sm font-semibold">
                                                    {med.totalPillsAvailable} Pills
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Simple reusable component for stats
const StatCard = ({ title, value, icon, color, bg }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-cardBlue p-6 rounded-xl border border-slate-700 shadow-lg flex items-center gap-4"
    >
        <div className={`p-4 rounded-lg ${bg} ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-textGray text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    </motion.div>
);

export default Dashboard;