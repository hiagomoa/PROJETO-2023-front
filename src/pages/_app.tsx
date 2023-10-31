//import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import theme from "../styles/theme/theme";

import { AuthProvider } from "@/context/auth.context";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { queryClient } from "../common/services/queryClient";
import { ProfessorProvider } from "../context/professor.context";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  useEffect(() => {
    console.log(process.env.HOST_URL);
  }, []);
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ProfessorProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </QueryClientProvider>
      </ProfessorProvider>
    </AuthProvider>
  );
}
