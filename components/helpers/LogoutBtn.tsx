"use client"
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation"

export const LogoutBtn = () => {
    
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/signin");
    }

  return (
    <button className="xs:hidden flex items-center gap-5 text-md text-text"
    onClick={handleLogout}
    >
        <i className="fa-solid fa-arrow-right-from-bracket text-2xl"></i>
    </button>
  )
}
