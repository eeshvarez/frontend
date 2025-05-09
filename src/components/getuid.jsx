import React from "react";
import { useEffect, useState } from "react";


const getuid=()=>{

    const [islooged, setlogged]=useState(false)
    const [getuser, setuser]=useState()

    useEffect(() => {
        const uid = localStorage.getItem('uid')
        console.log('uid: ',uid )
        uid ? (setuser(uid), setlogged(true)):(setuser("no uid from getuid"),setlogged(false))


    }, [])
    return getuser
}

export default getuid