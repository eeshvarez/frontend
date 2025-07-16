import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import getuid from "../components/getuid";
import '../assets/css/warehouse.css'
// import Bulkuplaod from "../components/Bulkupload" ;
// import Addrow from "../components/Addrow";

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
    const [addrow, setaddrow]=useState(false)
    const[new_row,set_newrow]=useState({})
    const [bulk_uplaod, setbulk_upload]= useState(false)
    const [addfile, setaddfile]=useState(null)

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
                // console.log(table.data)
                if(table.data['status']=='fetched'){
                    settable_data(table.data.table_Data)
                    // console.log(table.data.table_Data)
                }
                setLoading(false);
            }
            else{
                // console.log('no user found')
            }

        }
        get_table()

        // {
        //     getuser ? console.log('this is userid: ',getuser) : console.log('no user')
        // }


        




    }, [getuser,edit_table])
    
    // console.log('this is table data2: ',table_data)
    const handleselect=(e,val)=>{
        if (e.target.checked){
            const add_val=[...list,val]
            setlist(add_val)
            // console.log('final_list',add_val)

        }
        else{
            const add_val=list.filter(i=>i!==val)
            setlist(add_val)
            // console.log('final_list',add_val)

        }
    }
    // console.log("this is list: ",list)

    const handlecselecteditclick=()=>{
        setselectedit(!selectedit)
    }
    const sendrows = async ()=>{
        // console.log('Sending rows as query:', `?rowsdata=${list.join('&rowsdata=')}`);
        setedit(!edit)
        
        if(getuser){
            let splited_uid=getuser.split(" ")[0]
            const res=await axios.post('http://127.0.0.1:8000/selectedrows',{
                
                    'uid'      : splited_uid,
                    'rowsdata' : list
                
            })
            if(res.status==200){
                // console.log(res.data.data)
                setEdit_table(res.data.data)
            }
        }

    }


    const handleeditable=(e,id)=>{

        const {name,value} = e.target
        setEdit_table((i)=>{
            const updated=[...i]
            // console.log('this is editable data:',updated)
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
        // console.log('filtering')
        let filterdata={
            'col':selectdata,
            'val':search
        }
        // console.log("this is filterdata",filterdata)
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
    // console.log(`this is filterd data ${filterd_data}`)

    const handle_new_row=(e,head_data)=>{
        set_newrow((prev)=>({
            ...prev,
            [head_data]:e.target.value
        }))
        // set_newrow(e.target.value, indexx)    
    }
    const handle_new_sbmit=async(e)=>{
        e.preventDefault()
        let splited_uid=getuser.split(" ")[0]
        const res = await axios.post("http://127.0.0.1:8000/addrow",{
            'uid':splited_uid,
            "new_data":new_row
        })
        console.log("res_status",res.status)
        if(res.data['response']=="success"){
            window.location.reload()
        }
        console.log("this is newwwwwwwwww",new_row)
    }
    const downloadFile = async (e) => {
        e.preventDefault();  // Prevent default form behavior
      
        const res = await axios.post(
          "http://localhost:8000/download-template-csv",
          { uid: getuser.split(" ")[0] }, // sending UID in body
          { responseType: "blob" }         // tell Axios to expect a file
        );
      
        // Create a link from blob and click it to download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([res.data]));
        link.download = "Data_Uplaod.csv";   // this sets the filename
        link.click();                     // auto-click to start download
      };

      const handleaddfile=(e)=>{
        const a_file =e.target.files[0]
        console.log(a_file)
        setaddfile(a_file)
      }

      const handlenewfile = async (e) =>{
        e.preventDefault()
        let splited_uid=getuser.split(" ")[0]
        const formdata= new FormData();
        formdata.append('mynewfile',addfile)
        formdata.append('uid',splited_uid)
      
        // console.log(formdata.entries)

        try{
            const response = await axios.post('http://127.0.0.1:8000/addnewfile' , formdata , {
                headers:{
                    'content-type' : 'multipart/form-data'
                }
            })
            console.log('response for file upload: ',response.data)
            if (response.data['status']=='200'){
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
      
      
    return(
        <>
        {
            addrow && (
                <div className="popup-overlay">
                <div className="mid-body">
                    <h1>ADD DATA TO YOUR DATABASE HERE.</h1>
                    <center><form onSubmit={handle_new_sbmit}>
                        {Object.keys(table_data[0]).map((head_data,indexx)=>(
                            
                            head_data !== "unique_code" && head_data !== "SLNO" ?(
                            <React.Fragment key={indexx}>    
                                <label id={indexx}>{head_data}</label>
                                <input id="new_row_inpt" type="text" name={head_data} value={new_row[head_data] || ""} placeholder={`enter your ${head_data}`} onChange={(e)=>handle_new_row(e,head_data)}/>
                            </React.Fragment>
                            ):null
                            
                        ))}
                        <button id="ne_ro_btn"type="submit" >Submit</button>
                    </form></center>
                </div>
                </div>
            ) 
        }
        
          <form className="filter" onSubmit={handle_filter}>
            {table_data.length > 0 ? (
                <>
                <select
                    value={selectdata}
                    onChange={(e) => {setselectdata(e.target.value), setcolumn_selected(true)}}
                    className="filter-select"
                    required
                >
                    {/* {console.log("this i sc",column_selected)} */}
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

            <button className="bulk-btn" onClick={(e)=>{(setbulk_upload(!bulk_uplaod))}}>Bulk Upload</button>
            
        
            <select className="add_sec" onChange={(e)=>{if(e.target.value === "Row")setaddrow(true)}}>
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
                                    return header != 'SLNO' ? (
                                    <th key={idx}>
                                    <input value={header} readOnly style={{outline:"none"}}/>
                                
                                    </th>
                                    ):null})}
                            </tr>
                        </thead>
                        <tbody>
                            
                            {                     
                                filterd_data.length>0 ? (filterd_data.map((row, i) => (
                                <tr key={i}>
                                    <td style={{display: selectedit ? "":"none"}}><input type="checkbox"  key={i}  onChange={(e)=>handleselect(e,row['unique_code'])}/></td>

                                    {
                                    Object.entries(row).map(([key,val], j) => (
                                        key != 'SLNO' ?
                                        <td key={j}><input value={val|| ""} readOnly style={{outline:"none",border:"none",background:"none"}}/></td>
                                        :null
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
                            {Object.keys(edit_table[0]).map((val,key)=>{
                                return val != "SLNO" ?(
                                    <th key={key}><input value={val ||""} readOnly style={{outline:"none"}}/></th>
                                ):null})}
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
                                                key != "SLNO" ?
                                                <td key={i}> 
                                                <input
                                                style={{outline:"none",border:"none",background:"none"}}
                                                value={val || ""}
                                                name={key}
                                                onChange={(e) => handleeditable(e, id)}
                                                readOnly={key === 'unique_code'}
                                                onClick={key === 'unique_code' ? handleavoid : undefined}
                                                />
                                            </td>:null
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
            {
                bulk_uplaod &&(
                    <div className="bulk_pop_up">
                        <div className="bulk_pop_sub">
                            <h4>Download Template to add data</h4>
                            <input type="file" accept=".csv, .xls, .xlsx" onChange={handleaddfile} required/>
                            <button type="submit" onClick={handlenewfile}>SUBMIT</button><br/>
                            <p>NOTE: DOn't change the headers.. it will effect the data</p>
                            <button onClick={downloadFile}>Download Template</button>
                            {
                                addfile && (
                                    <p>{addfile.name}</p>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </>

    )
}
export default Warehouse