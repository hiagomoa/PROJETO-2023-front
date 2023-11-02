import { API_HOST } from "@/common/utils/config";
import cookies from "js-cookie";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

type TypeAuthContext = {
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
export const AuthContext = createContext({} as TypeAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);

  async function signIn(email: string, password: string) {
    await fetch(API_HOST + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        cookies.set("token", data.token, { expires: 60 * 60 });
        cookies.set("role", data.user.role, { expires: 60 * 60 });
        setUser(data.user);

        if (data.user.role === "PROFESSOR") {
          router.push("/professor");
        }

        if (data.user.role === "STUDENT") {
          router.push("/aluno");
        }

        if (data.user.role === "ADMIN") {
          router.push("/adm");
        }
      })
      .catch((err) => toast.error("Email ou senha incorretos"));
  }
  const router = useRouter();

  async function signOut() {
    cookies.remove("token");
    setUser(null);

    setTimeout(() => {
      router.push("/");
    }, 300);
  }

  async function refreshToken() {
    const token = cookies.get("token");
    try {
      const newJWT = await fetch(API_HOST + "/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const newJWTData = await newJWT.json();

      cookies.set("token", newJWTData.token, {
        expires: 60 * 60,
      });
      cookies.set("role", newJWTData.user.role, {
        expires: 60 * 60,
      });

      setUser(newJWTData.user);

      if (newJWTData.user.role === "PROFESSOR") {
        router.push("/professor");
      }

      if (newJWTData.user.role === "STUDENT") {
        router.push("/aluno");
      }

      if (newJWTData.user.role === "ADMIN") {
        router.push("/adm");
      }
    } catch (err) {
      cookies.remove("token");
      cookies.remove("role");
      setUser(null);
      router.push("/");
    }
  }

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      refreshToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
