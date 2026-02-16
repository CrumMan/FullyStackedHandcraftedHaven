"use client"
import { useRouter } from "next/navigation";
export default function DeleteAccountLink(){
    const router = useRouter()
    const handleClick = (e:React.MouseEvent) => {
        e.preventDefault();
        const confirmed = window.confirm(`Are you sure you want to delete your account? (All of your products will be deleted as well.)`)
        if(confirmed){router.push(`/account/delete`)}
    }
    return(<a onClick={handleClick}> Delete Account</a>)
}
