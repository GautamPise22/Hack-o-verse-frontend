import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
  const [shopData, setShopData] = useState(null);
  const [currentView, setCurrentView] = useState("login"); // 'login' | 'register' | 'dashboard'

  // Check Local Storage on Load
  useEffect(() => {
    const savedShop = localStorage.getItem("shopData");
    if (savedShop) {
      setShopData(JSON.parse(savedShop));
      setCurrentView("dashboard");
    }
  }, []);

  const handleLogin = (data) => {
    localStorage.setItem("shopData", JSON.stringify(data));
    setShopData(data);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("shopData");
    setShopData(null);
    setCurrentView("login");
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
      
      {currentView === "dashboard" && shopData && (
        <Dashboard shopData={shopData} onLogout={handleLogout} />
      )}

      {currentView === "login" && (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setCurrentView("register")} 
        />
      )}

      {currentView === "register" && (
        <Register 
          onSwitchToLogin={() => setCurrentView("login")} 
        />
      )}
    </>
  );
}

export default App;