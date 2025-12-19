import React from "react";
import AppLogo from "../atoms/app-logo";
// import { Inter } from "next/font/google"; // Disabled due to network issues
import { cn } from "@/_core/utils";

// const inter = Inter({
//   weight: "400",
//   subsets: ["latin"],
// });
interface AuthLeftColProps {
  title?: string;
  subtitle?: string;
}

export const AuthLeftCol = ({
  title = "LITTLE X",
  subtitle = "Your space to connect.",
}: AuthLeftColProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex items-center justify-center">
          <AppLogo />
        </div>
        <h1 className={cn("text-3xl font-bold font-sans")}>
          {title}
        </h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};
