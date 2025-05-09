import React  from "react";
// import wl from './assets/waregent logo.png'
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Link } from "react-router-dom";
import Warehouse from "./pages/warehouse";
import Login from "./pages/Login"
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";

function App(){


  const[islogged, setloged]=useState("")

  useEffect(() => {
    const uid = localStorage.getItem('uid')
    uid ? setloged(uid) : setloged("")

    
    if (islogged){
      const auto_login= async() =>{
        const resp= await axios.get('http://127.0.0.1:8000/autolog', uid)
        console.log(resp);
      }
    }

  }, [])
  
  
  return(
    
    <>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      {islogged &&
      <Route path="/warehouse" element={<Warehouse/>}/>
      }
      <Route path="/login" element={<Login/>}/>
      <Route path="/waregent" element={<Login/>}/>
    </Routes>
    <Footer/>
    </>
  )
}

export default App