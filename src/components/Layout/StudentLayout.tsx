import { Outlet } from "react-router-dom";
import StudentHeader from "../Header/StudentHeader";
import Footer from "../Footer/Footer";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <StudentHeader />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
