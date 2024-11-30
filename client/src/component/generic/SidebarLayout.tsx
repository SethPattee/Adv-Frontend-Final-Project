import React, { ReactNode } from "react";
import "../styles/SidebarLayout.scss";

interface SidebarLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ sidebar, children }) => {
  return (
    <div className="sidebar-layout">
      <aside className="sidebar">{sidebar}</aside>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default SidebarLayout;
