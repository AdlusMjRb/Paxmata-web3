import React from "react";
import Head from "next/head";
import Modal from "react-modal";
import { ParallaxProvider } from "react-scroll-parallax";
import { UserProvider } from "../context/UserContext";
import { ProjectProvider } from "../context/ProjectContext";
import "../styles/globals.css";
import Header from "../src/components/Header/Header";

Modal.setAppElement("#__next");

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <ProjectProvider>
        <Head>
          <title>Your Site Title</title>
          <meta name="description" content="Your site description" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <ParallaxProvider>
          <main>
            <Component {...pageProps} />
          </main>
        </ParallaxProvider>
      </ProjectProvider>
    </UserProvider>
  );
}

export default MyApp;
