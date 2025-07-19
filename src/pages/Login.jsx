import React, { use } from "react";
import Header from "../components/Header";
import { useState} from "react";
import '../assets/css/login.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login (){
    
    const navigate = useNavigate()
    const[username,setusername]=useState()
    const[password, setpassword]=useState()
    const[islogged, setloged]=useState("")
      const handlechange=(e,name)=>{
            let val=(e.target.value)
            if (name=="username"){
                setusername(val)
            }
            else{
                setpassword(val)
            }
            console.log(val);
      }
      const submitUserLogin = async(e) => {
        e.preventDefault(); 
        let objj={
            'username':username,
            'password':password
        }
        try{
            const res= await axios.post('https://backend-anrv.onrender.com/login', objj)
            console.log('res',res.data)
            if (res.data['status']=='true'){
                localStorage.setItem('uid',username+' '+password)
                navigate('/warehouse')
                window.location.reload();

            }
            else if (res.data['status']=='false') {
                localStorage.setItem('uid',username+' '+password)
                navigate('/')
                window.location.reload();
            } else {
                console.log(res.data['status'])
            }
            // res ? console.log("logged successfully..."):console.log('login failed.')
        }
        catch(error){
            console.log(error)
        }
        // console.log("Login submitted", objj); 
      };
    
    return(
        <>
            <div className="log-head">
                <h1>Login</h1>
            </div>
            <div className="login-form">
                <form onSubmit={submitUserLogin}>
                    <label>Username</label><br/>
                    <input type="text" value={username || ""} name='username' placeholder="enter yor email"  onChange={(e)=> handlechange(e, "username")}/><br/><br/>

                    <label>Password</label><br/>
                    <input type="password" value={password || ""} name="pswd" placeholder="enter your password" onChange={(e)=> handlechange(e, "pswd")}/><br/><br/>
                    <input type="submit" value="SUBMIT"/>
                </form>
            </div>
        </>
    )
}

export default Login