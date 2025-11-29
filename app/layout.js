import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/partials/header/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserInfoProvider } from "@/context/UserInfoContext";
import VisitTracker from "@/components/analytics/VisitTracker";
import NotificationSystem from "@/components/NotificationSystem";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserInfoProvider>
          <Header />
          <VisitTracker />
          {/* Mobile padding: top for mobile header, bottom for mobile nav */}
          <main className="md:pt-24 pt-16 pb-16 md:pb-0">
            {children}
          </main>
          <NotificationSystem />
        </UserInfoProvider>
        <ToastContainer draggable theme="dark" />
      </body>
    </html>
  );
}