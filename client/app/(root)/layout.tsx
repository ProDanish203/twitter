import { Rightbar } from "@/components/base_layout/rightbar";
import { Sidebar } from "@/components/base_layout/sidebar";
import React from "react";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="relative flex min-h-screen max-w-xl mx-auto overflow-x-clip">
      <div>
        <Sidebar />
      </div>
      <div>{children}</div>
      <div>
        <Rightbar />
      </div>
    </main>
  );
};

export default MainLayout;
