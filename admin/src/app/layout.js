import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/components/redux/provider";
import SessionExpiredModal from "@/components/common/SessionExpiredModal";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "VocaRent",
    template: "%s | VocaRent",
  },
  description: "VocaRent - AI-Based Rent Management System",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        id="razorpay-script"
      />
      <body
        className={`
          ${inter.variable}
          antialiased
          bg-white text-gray-800
          dark:bg-gray-900 dark:text-white
          transition-colors duration-300 
        `}
      >
        <Toaster />
        <ReduxProvider>
          <SessionExpiredModal />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}