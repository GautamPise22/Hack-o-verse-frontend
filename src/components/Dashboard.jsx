import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Package, Pill, TrendingUp, LogOut, Search, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = ({ shopData, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Data on Load
  const fetchData = async () => {
    try {
      // 1. Get Stats
      const statsRes = await axios.get(`http://localhost:5000/api/inventory/stats/${shopData.shop_id}`);
      setStats(statsRes.data);
      console.log(shopData.shop_id);

      // 2. Get Inventory
      const invRes = await axios.get(`http://localhost:5000/api/inventory/view/${shopData.shop_id}`);
      setMedicines(Array.isArray(invRes.data) ? invRes.data : []);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Selling
  const handleSell = async (medicine, subCode = null) => {
    const customerName = prompt("Enter Customer Name:");
    if (!customerName) return;

    try {
      const payload = {
        shop_id: shopData.shop_id,
        textCode: medicine.textCode,
        customer_name: customerName,
        subCode: subCode // Will be null if selling whole unit
      };

      const res = await axios.post("http://localhost:5000/api/inventory/sell", payload);
      toast.success(res.data.message);
      fetchData(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.message || "Sale failed");
    }
  };

  // Filter Search
  const filteredMedicines = medicines.filter(med => 
    med.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-deepBlue p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-cyan-400">Welcome, {shopData.shop_name}</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-900/30 text-red-400 rounded-lg transition border border-slate-700">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid gap-6">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Stock" 
            value={stats?.totalMedicinesReceived || 0} 
            icon={<Package size={24} />} 
            color="text-blue-400" 
            bg="bg-blue-500/10"
          />
          <StatCard 
            title="Pills Sold" 
            value={stats?.totalPillsSold || 0} 
            icon={<TrendingUp size={24} />} 
            color="text-green-400" 
            bg="bg-green-500/10"
          />
          <StatCard 
            title="Pills Remaining" 
            value={stats?.totalPillsRemaining || 0} 
            icon={<Pill size={24} />} 
            color="text-cyan-400" 
            bg="bg-cyan-500/10"
          />
        </div>

        {/* INVENTORY SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cardBlue rounded-xl shadow-lg border border-slate-700 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-xl font-semibold text-white">Live Inventory</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search medicines..." 
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
                  <th className="p-4">Expiry</th>
                  <th className="p-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                   <tr><td colSpan="4" className="p-8 text-center text-slate-500">Loading inventory...</td></tr>
                ) : filteredMedicines.length === 0 ? (
                   <tr><td colSpan="4" className="p-8 text-center text-slate-500">No medicines found.</td></tr>
                ) : (
                  filteredMedicines.map((med) => (
                    <tr key={med._id} className="hover:bg-slate-800/50 transition">
                      <td className="p-4 font-medium text-white flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                           {med.medicine_name.substring(0,2).toUpperCase()}
                         </div>
                         {med.medicine_name}
                      </td>
                      <td className="p-4 text-textGray">{med.brand_name}</td>
                      <td className="p-4 text-textGray">{new Date(med.expiry_date).toLocaleDateString()}</td>
                      <td className="p-4">
                        {med.type === "strip" ? (
                          <div className="flex flex-wrap gap-2">
                            {med.subTextCodes.map((pill) => (
                              <button
                                key={pill.code}
                                onClick={() => pill.status === 'active' && handleSell(med, pill.code)}
                                disabled={pill.status !== 'active'}
                                className={`w-8 h-8 rounded-full text-xs flex items-center justify-center transition border ${
                                  pill.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500 hover:text-white cursor-pointer' 
                                  : 'bg-red-500/10 text-red-500 border-red-500/10 cursor-not-allowed line-through'
                                }`}
                                title={pill.status === 'active' ? `Sell Pill ${pill.code}` : 'Sold'}
                              >
                                {pill.code.substring(0,1)}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button 
                            onClick={() => !med.is_selled && handleSell(med)}
                            disabled={med.is_selled}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              !med.is_selled 
                              ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {med.is_selled ? "Sold Out" : "Sell Unit"}
                          </button>
                        )}
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