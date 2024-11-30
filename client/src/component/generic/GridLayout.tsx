import React, { ReactNode } from "react";
import "../styles/GridLayout.scss";

interface GridLayoutProps {
  children: ReactNode;
  gap?: string;
}

const GridLayout: React.FC<GridLayoutProps> = ({ children, gap = "1rem" }) => {
  const style = {
    "--gap": gap,
  } as React.CSSProperties;

  return <div className="grid-layout" style={style}>{children}</div>;
};

export default GridLayout;
