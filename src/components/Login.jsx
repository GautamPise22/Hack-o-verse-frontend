import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, Store, User } from "lucide-react";
import toast from "react-hot-toast";

const Login = ({ onLogin, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            //   const res = await axios.post("http://localhost:5000/api/auth/login", formData);
            const API_URL = import.meta.env.VITE_API_URL;
            const res = await axios.post(`${API_URL}/api/auth/login`, formData);
            if (res.data.success) {
                toast.success("Login Successful!");
                onLogin(res.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-deepBlue overflow-hidden relative">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 bg-cardBlue p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md backdrop-blur-sm"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-500/10 rounded-full">
                        <Store className="w-10 h-10 text-cyan-400" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-2">Shop Access</h2>
                <p className="text-center text-textGray mb-8">Manage your medical inventory</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition border border-slate-700"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition border border-slate-700"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:scale-[1.02] active:scale-95"
                    >
                        {loading ? "Verifying..." : "Login to Dashboard"}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-6 text-sm">
                    Don't have a shop ID?{" "}
                    <button onClick={onSwitchToRegister} className="text-cyan-400 hover:underline">
                        Register here
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;