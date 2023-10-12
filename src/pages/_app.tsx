//import "@/styles/globals.css";
import theme from "@/styles/theme/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "react-query";

import "react-toastify/dist/ReactToastify.css";
import { queryClient } from "@/common/services/queryClient";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
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
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}
