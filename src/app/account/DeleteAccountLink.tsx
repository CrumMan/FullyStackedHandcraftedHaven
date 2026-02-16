"use client"
import { useRouter } from "next/navigation";
export default function DeleteAccountLink(){
    const router = useRouter()
    const handleClick = (e:React.MouseEvent) => {
        e.preventDefault();
        const confirmed = window.confirm(`Are you sure you want to delete your account? (All of your products will be deleted as well.)`)
        if(confirmed){router.push(`/account/delete`)}
    }
    return(<button className="bg-accent text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" onClick={handleClick}> Delete Account</button>)
}
