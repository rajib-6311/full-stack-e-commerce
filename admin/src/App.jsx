import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Login from "./pages/Login";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  useEffect(() => {
    localStorage.getItem('token', token)
  }, [token])

  return (
    <main className="bg-gray-50 w-full min-h-screen">
      <Toaster />

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar token={token} setToken={setToken} />
          <div className="flex w-full">
            {/* Sidebar */}
            <div className="w-[18%] fixed min-h-screen border-r border-gray-300">
              <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 px-6 py-2 ml-[18%]">
              <Routes>
                <Route path="/" element={<Home token={token}/>} />
                <Route path="/add" element={<AddProduct token={token} />} />
                <Route path="/list" element={<List token={token}/>} />
                <Route path="/orders" element={<Orders token={token}/>} />
                <Route path="/users" element={<Users token={token}/>} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default App;
