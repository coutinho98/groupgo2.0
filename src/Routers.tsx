import { Routes, Route } from "react-router"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import ForgotPassword from "@/pages/ForgotPassword"
import Perfil from "@/pages/Perfil"
import CreateEvent from "@/pages/CreateEvent"
import Event from "@/pages/Event"
import ProtectedRoute from "@/ProtectedRoute"

export default function Routers() {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/createEvent"
                element={
                    <ProtectedRoute>
                        <CreateEvent />
                    </ProtectedRoute>
                } />
            <Route path="/event"
                element={
                    <ProtectedRoute>
                        <Event />
                    </ProtectedRoute>
                } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
                path="/perfil"
                element={
                    <ProtectedRoute>
                        <Perfil />
                    </ProtectedRoute>
                } />
        </Routes>
    )
}
