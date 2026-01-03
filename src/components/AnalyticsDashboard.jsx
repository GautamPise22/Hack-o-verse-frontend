import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { TrendingUp, Filter, Calendar } from "lucide-react";

const AnalyticsDashboard = ({ shopId }) => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("daily"); // daily, monthly, yearly, custom
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);

  // Fetch Data Function
  const fetchAnalytics = async () => {
    if (!shopId) return;
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      let query = `?range=${range}`;

      if (range === "custom" && customDates.start && customDates.end) {
        query += `&startDate=${customDates.start}&endDate=${customDates.end}`;
      }

      const res = await axios.get(`${API_URL}/api/analytics/sales/${shopId}${query}`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately if not custom, or if custom dates are ready
    if (range !== "custom" || (customDates.start && customDates.end)) {
      fetchAnalytics();
    }
  }, [range, shopId, customDates]);

  return (
    <div className="bg-cardBlue p-6 rounded-xl border border-slate-700 shadow-lg mt-8 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-cyan-400" /> Sales Analytics
          </h2>
          <p className="text-slate-400 text-sm">Visualize your sales performance</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 items-center bg-slate-900 p-2 rounded-lg border border-slate-700">
          {["daily", "monthly", "yearly"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded text-sm capitalize transition ${
                range === r ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
          
          <div className="h-4 w-px bg-slate-700 mx-1"></div>

          {/* Custom Date Inputs */}
          <div className="flex items-center gap-2">
             <input 
               type="date" 
               className="bg-slate-800 text-white text-xs p-1 rounded border border-slate-600 focus:border-cyan-500 outline-none"
               onChange={(e) => {
                 setCustomDates({...customDates, start: e.target.value});
                 setRange("custom");
               }}
             />
             <span className="text-slate-500">-</span>
             <input 
               type="date" 
               className="bg-slate-800 text-white text-xs p-1 rounded border border-slate-600 focus:border-cyan-500 outline-none"
               onChange={(e) => {
                 setCustomDates({...customDates, end: e.target.value});
                 setRange("custom");
               }}
             />
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[350px] w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-500 animate-pulse">Loading Chart Data...</div>
        ) : data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
            <Calendar size={48} className="mb-2 opacity-20" />
            <p>No sales data found for this period.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickFormatter={(value) => {
                    if(range === 'daily') return value.substring(5); // Show MM-DD
                    return value;
                }}
              />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff", borderRadius: "8px" }}
                itemStyle={{ color: "#fff" }}
                cursor={{ fill: 'rgba(34, 211, 238, 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="sales" name="Items Sold" fill="#22d3ee" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="orders" name="Total Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;