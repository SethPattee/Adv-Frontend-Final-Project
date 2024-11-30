import React, { ReactNode } from "react";
import "../styles/CenteredLayout.scss";

interface CenteredLayoutProps {
  children: ReactNode;
  className?: string;
}

const CenteredLayout: React.FC<CenteredLayoutProps> = ({ children, className = "" }) => {
  return <div className={`centered-layout ${className}`}>{children}</div>;
};

export default CenteredLayout;
