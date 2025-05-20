import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "Admin" | "Manager" | "Nurse" | "Parent" | "Student";

interface User {
    username: string;
    role: Role;
}

// Fake user data for testing
const fakeUsers: Record<string, { password: string; role: Role }> = {
    admin: { password: "admin123", role: "Admin" },
    manager: { password: "manager123", role: "Manager" },
    nurse: { password: "nurse123", role: "Nurse" },
    parent: { password: "parent123", role: "Parent" },
    student: { password: "student123", role: "Student" }
};

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = () => {
        const userData = fakeUsers[username];
        if (userData && userData.password === password) {
            const user: User = { username, role: userData.role };
            localStorage.setItem("user", JSON.stringify(user));
            navigate(`/${userData.role.toLowerCase()}`);
        } else {
            setError("Sai tài khoản hoặc mật khẩu");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br /><br />
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />
            <button onClick={handleLogin}>Login</button>
            {error && (
                <>
                    <br />
                    <span style={{ color: "red" }}>{error}</span>
                </>
            )}
        </div>
    );
}