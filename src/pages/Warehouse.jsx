import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import getuid from "../components/getuid";
import '../assets/css/warehouse.css'
import Bulkuplaod from "../components/Bulkupload" ;

function Warehouse(){
    const getuser = getuid();
    const [table_data, settable_data] = useState([])
    const [loading, setLoading] = useState(true);
    const [selectedit,setselectedit]=useState(false)
    const [list, setlist] = useState([])
    const [edit_table, setEdit_table] = useState([])
    const [edit,setedit]=useState(false)
    const [selectdata,setselectdata]=useState("")
    const [search, setsearch]=useState("")
    const [find, setfind]=useState(false)
    const [column_selected, setcolumn_selected]=useState(false)

    // console.log("first getuser: ",getuser)
    useEffect(() => {
        const get_table = async () =>{
            if(getuser){
                let splited=getuser.split(" ")[0]
                const table= await axios.get('http://127.0.0.1:8000/get_table', {
                    params:{
                        uid: splited
                    }
                })
                console.log(table.data)
                if(table.data['status']=='fetched'){
                    settable_data(table.data.table_Data)
                    console.log(table.data.table_Data)
                }
                setLoading(false);
            }
            else{
                console.log('no user found')
            }

        }
        get_table()

        {
            getuser ? console.log('this is userid: ',getuser) : console.log('no user')
        }


        




    }, [getuser,edit_table])
    
    // console.log('this is table data2: ',table_data)
    const handleselect=(e,val)=>{
        if (e.target.checked){
            const add_val=[...list,val]
            setlist(add_val)
            console.log('final_list',add_val)

        }
        else{
            const add_val=list.filter(i=>i!==val)
            setlist(add_val)
            console.log('final_list',add_val)

        }
    }
    // console.log("this is list: ",list)

    const handlecselecteditclick=()=>{
        setselectedit(!selectedit)
    }
    const sendrows = async ()=>{
        console.log('Sending rows as query:', `?rowsdata=${list.join('&rowsdata=')}`);
        setedit(!edit)
        
        if(getuser){
            let splited_uid=getuser.split(" ")[0]
            const res=await axios.post('http://127.0.0.1:8000/selectedrows',{
                
                    'uid'      : splited_uid,
                    'rowsdata' : list
                
            })
            if(res.status==200){
                console.log(res.data.data)
                setEdit_table(res.data.data)
            }
        }

    }


    const handleeditable=(e,id)=>{

        const {name,value} = e.target
        setEdit_table((i)=>{
            const updated=[...i]
            updated[id][name]=value
            return updated
        })

    }
    const handlecanceledit=()=>{
        setedit(false)
        setEdit_table([])
        setlist([])
        setselectedit(!selectedit)

    }

    const handlesendeditedrows= async()=>{
        if(getuser){
            let splited_uid=getuser.split(" ")[0]
            const res= await axios.post('http://127.0.0.1:8000/editrows',{
                'uid': splited_uid,
                'rowsdata' : edit_table
            })
            if (res.status==200){
                console.log('sent',edit_table)
                console.log(res.data)
                setedit(false)
                setEdit_table([])
                setselectedit(!selectedit)
                setlist([])
            }
        }

    }
    const handleavoid=()=>{
        alert("You cant edit identifier")
    }
    const handle_filter=(e)=>{
        e.preventDefault(); 
        console.log('filtering')
        let filterdata={
            'col':selectdata,
            'val':search
        }
        console.log("this is filterdata",filterdata)
        setfind(true)
    }
    const filterd_data=table_data.filter(item=>{
        const col=item[selectdata]
        if(!search){
            return true
        }
        if(String(col)?.toLowerCase().includes(search.toLowerCase())){
            return true
        }
    })
    console.log(`this is filterd data ${filterd_data}`)
    return(

        <>
        <div className="popup-overlay">
                    <div className="mid-body">
                    <Bulkuplaod/>
                    </div>
        </div>
          <form className="filter" onSubmit={handle_filter}>
            {table_data.length > 0 ? (
                <>
                <select
                    value={selectdata}
                    onChange={(e) => {setselectdata(e.target.value), setcolumn_selected(true)}}
                    className="filter-select"
                    required
                >
                    {console.log("this i sc",column_selected)}
                    <option value="">Select a column</option>
                    {Object.keys(table_data[0]).map((col, idx) => (
                    <option key={idx} value={col} >
                        {col}
                        {console.log(selectdata)}
                    </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Enter filter value"
                    className="filter-input"
                    required
                    onChange={(e)=>setsearch(e.target.value)}
                />
                {console.log(search)}
                {/* <button type="submit" className="filter-button">
                    Filter
                </button> */}
                </>
            ) : null}
            </form>

            {
            edit_table.length === 0 ? 
            <div className="btn_sec">
            
            <button className="select-btn" onClick={handlecselecteditclick}>Selective edit</button>
            <button className="bulk-btn">Bulk edit</button>
            <select className="add_sec">
                <option>New</option>
                <option>Row</option>
                <option>Column</option>
            </select>
            
            </div>:(undefined)
            }
            {loading ? (
                <h1 id="load">Loading...</h1>
            ) : table_data.length > 0  && edit_table.length === 0 ? (
                <div className="table-bg">
                    <table border="1" id="mytable">
                        <thead>
                            
                            <tr>
                                <th style={{ display: selectedit ? "" : "none" }}>
                                    {list.length > 0 && <button onClick={sendrows}>Edit</button>}
                                </th>
                                {Object.keys(table_data[0]).map((header,idx)=>{
                                    return<th key={idx}><input value={header} readOnly style={{outline:"none"}}/></th>
                                    })}
                            </tr>
                        </thead>
                        <tbody>
                            
                            {                     
                                filterd_data.length>0 ? (console.log("this is fff",filterd_data),filterd_data.map((row, i) => (
                                <tr key={i}>
                                    <td style={{display: selectedit ? "":"none"}}><input type="checkbox"  key={i}  onChange={(e)=>handleselect(e,row['unique_code'])}/></td>

                                    {
                                    Object.values(row).map((val, j) => (
                                        <td key={j}><input value={val|| ""} readOnly style={{outline:"none",border:"none",background:"none"}}/></td>
                                    ))}
                                </tr>
                            ))):<tr>
                            <td colSpan="30" border="0" style={{'color':'red'}}>
                              {column_selected ? "No Result" : "Please select the filter"}
                            </td>
                          </tr>}
                        </tbody>
                    </table>
                </div>
            ) : (
                ""
            )}
            { edit ? (
            <>
            <center><h1>Edit Your Table </h1></center>
            <div className="editable">
                {edit_table.length >0 ?
            
                    <table border="1" id="mytable">
                        <thead>
                            <tr>
                            {Object.keys(edit_table[0]).map((val,key)=>(
                                    <th key={key}><input value={val ||""} readOnly style={{outline:"none"}}/></th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                edit_table.map((rows,id)=>{
                                    return(
                                    <tr key={id}>
                                        {
                                            Object.entries(rows).map(([key, val],i)=>(
                                                // <td key={i}><input value={handleeditable ? editval : val || ""} name={i} onChange={(e)=>handleeditable(e,i)} /></td>
                                                <td key={i}> 
                                                <input
                                                style={{outline:"none",border:"none",background:"none"}}
                                                value={val || ""}
                                                name={key}
                                                onChange={(e) => handleeditable(e, id)}
                                                readOnly={key === 'unique_code'}
                                                onClick={key === 'unique_code' ? handleavoid : undefined}
                                                />
                                            </td>
                                            ))
                                        }
                                    </tr>
                                )})
                            }
                        </tbody>
                    </table>:"no table"
                    
                }
                <div className="bts-sec2">
                    <button onClick={handlesendeditedrows} id="bts-s1">Submit</button>
                    <button onClick={handlecanceledit}>Cancel</button>
                </div>
            </div>
            </>
            ):(undefined)
            }
        </>

    )
}
export default Warehouse