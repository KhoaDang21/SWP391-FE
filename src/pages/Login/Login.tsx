import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../../assets/files/BgLogin.json";
import { login } from "../../services/AuthServices";
import logo from "../../assets/images/medical-book.png";

const getRedirectPath = (role: string) => {
    switch (role) {
        case "Admin":
            return "/admin";
        case "Manager":
            return "/manager";
        case "Nurse":
            return "/nurse";
        case "Parent":
            return "/parent";
        case "Student":
            return "/student";
        default:
            return "/";
    }
};

const Login = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const payload = { username, password };
            const res = await login(payload);

            localStorage.setItem("user", JSON.stringify(res));

            const redirectPath = getRedirectPath(res.role);
            navigate(redirectPath, { replace: true });

        } catch (err: any) {
            setError(err.message || "Đã có lỗi xảy ra");
        }
    };


    return (
        <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-[#2bb0cf] to-white-600 relative">
            <div className="bg-white shadow-lg rounded-lg flex w-full max-w-5xl overflow-hidden">
                <div className="w-[60%] hidden md:flex items-center justify-center bg-[#3bc8e8] backdrop-blur-sm">
                    <Lottie
                        animationData={animationData}
                        loop
                        autoplay
                        style={{ width: 300, height: 300 }}
                    />
                </div>

                <div className="w-full md:w-[60%] p-8 md:p-10 flex flex-col justify-center">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Ngăn form reload
                            handleLogin();      // Gọi login
                        }}
                    >
                        <div className="flex items-center justify-center mb-6">
                            <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
                            <h1 className="text-3xl text-black font-bold">EduHealth</h1>
                        </div>

                        <div className="mb-6 text-center">
                            <h3 className="text-xl font-semibold mb-2">Xin chào!</h3>
                            <p className="text-base text-gray-600">Đăng nhập bằng tài khoản của bạn</p>
                        </div>

                        <div className="mb-4">
                            <label className="mb-1 text-sm font-medium text-gray-700 block">Tên đăng nhập</label>
                            <input
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="mb-1 text-sm font-medium text-gray-700 block">Mật Khẩu</label>
                            <input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-[#2283dd] text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300 mb-6 mt-6"
                        >
                            Đăng Nhập
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Login;
