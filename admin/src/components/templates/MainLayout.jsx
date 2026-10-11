"use client";
import { useState, useEffect } from "react";
import Sidebar from "../organisms/Sidebar";
import Header from "../organisms/Header";
import { useFetchUserOnLoad } from "../hooks/useFetchUserOnLoad";

const MainLayout = ({ children, title }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "auto";
  }, [drawerOpen]);
  useFetchUserOnLoad();
  return (
    <div className="h-screen w-full overflow-hidden flex ">
      <Sidebar
        isOpen={drawerOpen}
        isMobile
        onClose={() => setDrawerOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col bg-main">
        <Header title={title} onMenuClick={() => setDrawerOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
