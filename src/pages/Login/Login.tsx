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
export interface LoginResponse {
    data: {
        accessToken: string;
        refreshToken: string;
        role: string;
    };
}


const Login = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [submitError, setSubmitError] = useState<string>("");
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!username.trim()) {
            newErrors.username = "Vui lòng nhập tên đăng nhập.";
        }
        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu.";
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        setSubmitError("");
        if (!validate()) return;

        try {
            const payload = { username, password };
            const res = await login(payload);

            const { accessToken, role } = res;

            localStorage.setItem("user", accessToken);

            // Chuyển hướng theo role
            navigate(getRedirectPath(role), { replace: true });
        } catch (err: any) {
            setSubmitError(err.response?.data?.message || err.message || "Đã có lỗi xảy ra");
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-[#2bb0cf] to-white-600 relative">
            <div className="bg-white shadow-lg rounded-lg flex w-full max-w-5xl overflow-hidden">
                {/* Phần Lottie */}
                <div className="w-[60%] hidden md:flex items-center justify-center bg-[#3bc8e8] backdrop-blur-sm">
                    <Lottie animationData={animationData} loop autoplay style={{ width: 300, height: 300 }} />
                </div>

                <div className="w-full md:w-[60%] p-8 md:p-10 flex flex-col justify-center">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-center mb-6">
                            <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
                            <h1 className="text-3xl text-black font-bold">EduHealth</h1>
                        </div>

                        <div className="mb-6 text-center">
                            <h3 className="text-xl font-semibold mb-2">Xin chào!</h3>
                            <p className="text-base text-gray-600">Đăng nhập bằng tài khoản của bạn</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                            <input
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (errors.username) setErrors({ ...errors, username: undefined });
                                }}
                                onBlur={validate}
                                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.username
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                    }`}
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                            <input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: undefined });
                                }}
                                onBlur={validate}
                                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                    }`}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                        <button
                            type="submit"
                            className="w-full bg-[#2283dd] text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
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
