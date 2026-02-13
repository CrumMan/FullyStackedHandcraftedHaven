"use client"
import { deleteAccount } from "@/app/lib/actions"
import { useEffect, useState } from "react";
export default async function DeleteAccountFunction(){
    const [error, setError] = useState(false);
useEffect(()=>{
    async function handleDelete() {
            try{
                await deleteAccount()
                window.location.href = "/"

            }
            catch(error){
                console.log(error)
                setError(true)
                return <p>Error in deleting user.</p>
            }
        }
        handleDelete();
    },[])
    if(error){
        return <p>Error in deleting user</p>
    }
    return <p>Deleting account...</p>

}