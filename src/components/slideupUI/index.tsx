import React from "react";
interface SlideUpUIPropType {
  children: React.ReactNode;
}
export const SlideUpUI = ({ children }: SlideUpUIPropType): React.ReactNode => {
  return (
    <div className="slide-up-overlay">
      <div className="fixed z-100 h-[50vh] w-full card-shadow rounded-3xl bottom-0 p-6 bg-white">
        {children}
      </div>
    </div>
  );
};
