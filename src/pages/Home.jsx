import React from "react";
import '../assets/css/home.css'
import bannerimg from '../assets/imgs/bnimg.png'
import { useState, useEffect } from "react";
import wi from '../assets/imgs/waregent logo.png'
import axios from 'axios';
import warehouse from "./Warehouse";
import { useNavigate } from "react-router-dom";

function Home(){
    const [getuser, setuser]=useState()
    const [showPopup, setShowPopup] = useState(false);
    const [file, setfile]=useState(null)
    const [tablename, settablename]= useState('')
    const [islooged, setlogged]=useState(false)
    const navigate = useNavigate()
    useEffect(() => {

        const connect_to_backend = async ()=>{
            try{
                const response = await axios.get('https://backend-anrv.onrender.com/') 
                if (response){
                    console.log('connected')
                }
            }catch(e){
                console.log(e)
            }
            finally{
                console.log('success...')
            }
        }
        connect_to_backend()


        const uid = localStorage.getItem('uid')
        console.log('uid: ',uid )
        uid ? (setuser(uid), setlogged(true)):(setuser(""),setlogged(false))
    }, [])

    const handlefile=(e)=>{
        const up_data=e.target.files[0]
        setfile(up_data)

    }
    console.log('islooged: ',islooged)
    const handleTable= async ( )=>{
        const table = await axios.post('https://backend-anrv.onrender.com/create_table')
        {
            table && console.log('table created')
        }
     }
     const handlename=(e)=>{
        const tbname=e.target.value
        settablename(tbname)
        if (tablename){
            console.log(tbname)
        }
     }

    const handlesubmit=async(e)=>{
        e.preventDefault()
        const formdata= new FormData();
        formdata.append('myfile',file)
        formdata.append('tablename',getuser.split(" ")[0]+'_'+tablename)
      
        // console.log(formdata.entries)

        try{
            const response = await axios.post('https://backend-anrv.onrender.com/getfiles' , formdata , {
                headers:{
                    'content-type' : 'multipart/form-data'
                }
            })
            console.log('response for file upload: ',response.data)
            if (response.data['status']=='file uploaded'){
                navigate('/warehouse')
                window.location.reload()
                console.log('uploaded...')
            }
            else{
                // window.location.reload()
            }
        }
        catch(e){
            console.log(e)
        }
    }
    const handlefirstcheck = () => {
        if (islooged) {
          console.log('status:', true);
          const senduser = async ()=>{
            const tc=getuser.split(' ')[0]
            const res = await axios.get('https://backend-anrv.onrender.com/table_check' , {
                params:{
                    uid:tc
                }
            })
            console.log("res_data_table_check: ",res.data);

            if(res.data['status']=="table_checked"){
                navigate('/warehouse')
                window.location.reload()
            }
            else{
                setShowPopup(true);
            }
          }
          senduser()
          
        } else {
          navigate('/login');
        }
    };
      
    
    return(
        <>
            <h1 id="file_stat">File Uploaded failed...</h1>
            <div className="main_body">
                <div className="body_text">
                    <h1>Make Your Fulfillment Limitless</h1>
                    <p>Get your warehouse online 
                        <br/>today with Waregent!
                    </p>
                    <button className="exp_btn" onClick={handlefirstcheck}>Explore</button>
                </div>
                <div className="body_img">
                    <img src={bannerimg} id='bnimg' alt="banner image"/>
                </div>

                {/* <div className="dec-card1"></div>
                <div className="dec-card2"></div> */}
            </div>
            
            {/* <button onClick={handleTable}>Create table</button> */}


            <div className="main_body2">
                <img src={wi} alt="img" id="mb2_img"/>
                <div className="mb2_text">
                    <h1>Who are we?</h1>
                    <p>Users can upload data using XLSX or CSV files.<br/>
                    They can create unlimited columns and define column <br/>names based on the uploaded file.</p>
                    <button id="exp_btn" onClick={handlefirstcheck}>Explore</button>
                </div>
            </div>
            
            <div className="main_body3">
                <h1>What We Offer ?</h1>
                <div className="mb3_cards">
                    <div className="cardd">CWMS</div>
                    <div className="cardd">Automation Tools</div>
                    <div className="cardd">Demand Forcasting</div>
                    <div className="cardd">Data Tracking</div>
                </div>
            </div>

            <div className="main_body4">
                <h1>Take a Look</h1>
                <p>Lets create your own customized warehouse and make life more easy</p>

                <button id="start_btn" onClick={handlefirstcheck}>Let's Start</button>
            </div>


            {showPopup && (
                <div className="popup-overlay">
                    <div className="mid-body">
                    <form onSubmit={handlesubmit}>
                        <input type="text" placeholder="Enter table name" onChange={handlename} required/><br />
                        <input type="file" accept=".csv, .xls, .xlsx" onChange={handlefile} /><br />
                        {file && (
                        <div className="file-info">
                            <p><strong>File Name:</strong> {file.name}</p>
                            <p><strong>Type:</strong> {file.type}</p>
                            <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        )}
                        <button type="submit">Submit</button>
                    </form>
                    </div>
                </div>
            )}

        </>
    )
}

export default Home