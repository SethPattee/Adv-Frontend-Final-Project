import React, { ReactNode } from "react";
import "../styles/HeaderFooterLayout.scss";

interface HeaderFooterLayoutProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

const HeaderFooterLayout: React.FC<HeaderFooterLayoutProps> = ({ header, footer, children }) => {
  return (
    <div className="header-footer-layout">
      <header className="header">{header}</header>
      <main className="content">{children}</main>
      <footer className="footer">{footer}</footer>
    </div>
  );
};

export default HeaderFooterLayout;
