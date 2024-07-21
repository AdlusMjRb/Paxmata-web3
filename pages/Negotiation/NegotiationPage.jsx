import React from "react";
import styles from "./Styles/NegotiationPage.module.css";
import ProjectComponent from "./ProjectComponent";
import ChatComponent from "./ChatComponent";
import ContractComponent from "../contract creation/ContractComponent";
import { ProjectProvider } from "../../context/ProjectContext";

export const NegotiationPage = () => {
  return (
    <ProjectProvider>
      <div className={styles.negotiationPage}>
        <header className={styles.header}>
          <h1>Negotiation Page</h1>
        </header>
        <div className={styles.container}>
          <aside className={styles.leftColumn}>
            <ProjectComponent />
          </aside>
          <main className={styles.middleColumn}>
            <ChatComponent />
          </main>
          <aside className={styles.rightColumn}>
            <ContractComponent />
          </aside>
        </div>
      </div>
    </ProjectProvider>
  );
};

export default NegotiationPage;
