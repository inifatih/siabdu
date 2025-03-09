"use server"
import LoginPage from "@/app/authentication/auth/AuthLogin";
import login from "@/app/authentication/login/action";

export default async function Login(){
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <LoginPage login={login}/>
    </div>
  )
}
