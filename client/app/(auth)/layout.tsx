import React from "react";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="w-full min-h-screen">{children}</div>;
};

export default AuthLayout;
