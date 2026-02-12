"use client"
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../lib/actions";
import { useRouter } from "next/navigation";


export default function(){
    const router = useRouter()
    let [user,setUser] = useState<any>(null);
useEffect(()=>{
async function checkUser(){
    await logout()
    const ser = await getCurrentUser();
    setUser(ser);

    if(ser == null){
        setTimeout(() =>{
        window.location.href = '/';
        }),1500
    }
}
checkUser()
},[])   
    if (user == null) return <p>Logout successful</p>
    else return <p>Logout Failed</p>
    
}