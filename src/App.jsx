import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Warehouse from "./pages/Warehouse";
import Login from "./pages/Login";
import axios from "axios";

function App() {
  const [islogged, setloged] = useState("");

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      setloged(uid);

      // const auto_login = async () => {
      //   try {
      //     const resp = await axios.get("https://backend-anrv.onrender.com/autolog", {
      //       params: { uid: uid },
      //     });
      //     console.log("Auto login response:", resp.data);
      //   } catch (error) {
      //     console.error("Auto login failed:", error);
      //   }
      // };

      // auto_login();
    } else {
      setloged("");
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waregent" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
