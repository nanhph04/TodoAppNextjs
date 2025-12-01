import Header from "@/components/layouts/Header/Header";
import Sidebar from "@/components/layouts/Sidebar/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import "./layout.css";
export default function MainLayout({
    children,
}: Readonly<{} & { children: React.ReactNode }>) {
    return (
        <AuthProvider>
            <div className="main-layout-container">
                <Header />
                <div className="main-layout-content">
                    <Sidebar />
                    <div className="main-layout-children">
                        {children}
                    </div>
                </div>
            </div>
        </AuthProvider>
    );
}  