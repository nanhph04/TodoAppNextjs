import Header from "@/ui/components/Header/Header";
import Sidebar from "@/ui/components/Sidebar/Sidebar";
import "./layout.css";

export default function MainLayout({
    children,
}: Readonly<{} & { children: React.ReactNode }>) {
    return (
        <div className="main-layout-container">
            <Header />
            <div className="main-layout-content">
                <Sidebar />
                <main className="main-layout-children">{children}</main>
            </div>
        </div>
    );
}  