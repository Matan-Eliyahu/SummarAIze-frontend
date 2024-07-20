import React, { ReactNode, useState } from "react";
import styles from "./Tooltip.module.scss"; // Create and style this SCSS file

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right" | "user";
  hoverDelay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, placement = "top", hoverDelay = 300 }) => {
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  const handleMouseEnter = () => {
    if (timer) clearTimeout(timer);
    const timeoutId = window.setTimeout(() => setVisible(true), hoverDelay);
    setTimer(timeoutId);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setVisible(false);
  };

  return (
    <div className={styles.tooltipContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {visible && (
        <div className={`${styles.tooltip} ${styles[placement]}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
