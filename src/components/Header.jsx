
import React from "react"
import wl from '../assets/imgs/waregent logo.png'
import '../assets/css/header.css'
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
function Header(){
    const navigagte = useNavigate()
    const [getuser, setuser]=useState()
    const [islooged, setlogged]=useState(false)
    const handlelogout=()=>{
        localStorage.clear()
        navigagte('/login')
        window.location.reload()

    }
    useEffect(() => {
        const uid = localStorage.getItem('uid')
        uid ? (setuser(uid), setlogged(true)):(setuser(""),setlogged(false))
        console.log('header_uid checking',uid)
    }, [])
    return(
        <>
        <div className="main">
            <Link to='/'>
            <img src={wl} alt="waregent-logo" id='wlogo'/>
            </Link>
            {
                islooged ?
                <div>
                <p style={{fontWeight:"bold",'padding':'20px'}}>{getuser.split(' ')[0]}</p>
                <button onClick={handlelogout}>Logout</button>
                </div>
                :<Link to='/login' id="lg_link">Login</Link>
            }
        </div>

        
        </>
    )
}

export default Header