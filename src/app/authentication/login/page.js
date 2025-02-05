"use server"
import LoginPage from "@/app/authentication/auth/AuthLogin";
import login from "@/app/authentication/login/action";

export default async function Login(){
    return (
        <div>
            <LoginPage login={login}/>
        </div>
    )
}
