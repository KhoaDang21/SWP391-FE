export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
        role: string;
    };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await fetch("http://localhost:3333/api/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {

        let errorMsg = "Sai tài khoản hoặc mật khẩu";
        try {
            const errorData = await response.json();
            if (errorData?.message) errorMsg = errorData.message;
        } catch { }
        throw new Error(errorMsg);
    }


    const data = await response.json();
    return data.data;
}
