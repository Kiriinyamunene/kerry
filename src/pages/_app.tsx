import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Layout from "@/components/Layout";
import { AnimatePresence } from "framer-motion";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <AnimatePresence mode="wait">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AnimatePresence>
    </ThemeProvider>
  );
}
