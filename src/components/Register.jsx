import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Store, User, Lock, Hash, Phone, MapPin, Clock, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    shopId: "",
    shopName: "",
    ownerName: "",
    mobile: "",
    address: "",
    openingTime: "",
    closingTime: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send data to backend
      await axios.post("http://localhost:5000/api/auth/register", formData);
      toast.success("Registration Successful! Please Login.");
      onSwitchToLogin(); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-deepBlue relative overflow-y-auto py-10">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 bg-cardBlue p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-2xl backdrop-blur-sm"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">Register Medical Shop</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Section: Login Credentials */}
          <div className="md:col-span-2 text-cyan-400 font-semibold border-b border-slate-700 pb-2 mb-2">
            Login Details
          </div>

          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input name="username" required type="text" placeholder="Username" onChange={handleChange}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input name="password" required type="password" placeholder="Password" onChange={handleChange}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>

          {/* Section: Shop Details */}
          <div className="md:col-span-2 text-cyan-400 font-semibold border-b border-slate-700 pb-2 mt-4 mb-2">
            Shop Details
          </div>

          <div className="relative">
            <Store className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input name="shopName" required type="text" placeholder="Shop Name" onChange={handleChange}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>

          <div className="relative">
            <Hash className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input name="shopId" required type="text" placeholder="Shop ID (e.g. SHOP-123)" onChange={handleChange}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>

          <div className="relative">
            <UserCheck className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input name="ownerName" required type="text" placeholder="Owner Name" onChange={handleChange}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input name="mobile" required type="text" placeholder="Mobile Number" onChange={handleChange}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>

          <div className="relative md:col-span-2">
            <MapPin className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input name="address" required type="text" placeholder="Full Address" onChange={handleChange}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>

          <div className="relative">
            <Clock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input name="openingTime" required type="time" onChange={handleChange}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none [&::-webkit-calendar-picker-indicator]:invert" />
            <p className="text-xs text-slate-500 mt-1">Opening Time</p>
          </div>

          <div className="relative">
            <Clock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input name="closingTime" required type="time" onChange={handleChange}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none [&::-webkit-calendar-picker-indicator]:invert" />
             <p className="text-xs text-slate-500 mt-1">Closing Time</p>
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:scale-[1.02]"
            >
              {loading ? "Registering Shop..." : "Complete Registration"}
            </button>
          </div>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already registered?{" "}
          <button onClick={onSwitchToLogin} className="text-cyan-400 hover:underline">
            Login here
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;