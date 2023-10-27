//import "@/styles/globals.css";
import theme from "@/styles/theme/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

import { queryClient } from "@/common/services/queryClient";
import { ProfessorProvider } from "@/context/professor.context";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  useEffect(() => {
    console.log(process.env.HOST_URL);
  }, []);
  return (
    <>
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
            <SessionProvider session={session}>
              <Component {...pageProps} />
            </SessionProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </ProfessorProvider>
    </>
  );
}
