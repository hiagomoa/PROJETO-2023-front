import { API_HOST } from "@/common/utils/config";
import cookies from "js-cookie";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";

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
        setUser(data);

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
      .catch((err) => console.log(err));
  }
  const router = useRouter();

  async function signOut() {
    cookies.remove("token");
    setUser(null);

    router.push("/");
  }

  async function refreshToken() {
    const token = cookies.get("token");
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
