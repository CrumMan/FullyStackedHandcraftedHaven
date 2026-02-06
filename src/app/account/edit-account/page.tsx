"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { register, getCurrentUser, updateAccount } from "@/app/lib/actions";

export default function EditForm(){
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [user,setUser] = useState<any>(null);


const [formData,setFormData] = useState({
    username:"",
    name:"",
    email:"",
    bio:""
})
useEffect(() =>{
    async function fetchUser() {
        const userData = await getCurrentUser();
        if(userData){
            setUser(userData);
            setFormData({
                username: userData.username || "",
                name: userData.name || "",
                email: userData.email || "",
                bio: userData.bio || ""
            })
        }
    }
    fetchUser();
},[])

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

 async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataObj = new FormData(e.currentTarget)
    const result = await updateAccount(formDataObj) 

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/account?message=updated")
    }
  }
  if (!user) {
    return <div>Loading...</div>;
  }
    return(
    <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-primary mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-primary mb-1">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller (requires approval)</option>
              </select>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-primary mb-1">
                Bio (optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
                value={formData.bio}
                onChange={handleChange}

              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Editing..." : "Edit Account"}
            </button>
          </form>
    )
}
