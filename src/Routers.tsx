import { Routes, Route } from "react-router"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import ForgotPassword from "@/pages/ForgotPassword"

export default function Routers() {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
    )
}
