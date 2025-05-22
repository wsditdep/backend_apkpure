import '@fortawesome/fontawesome-free/css/all.min.css';
import "./styles/auth.scss";
import "./styles/appLayout.scss";
import "./styles/styles.scss";
import "./styles/global.scss";
import { Toaster } from "react-hot-toast";
import favicon from "@/public/favicon.ico";
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: "Control Center - Home",
  description: "Backend Management",
  icons: {
    icon: {
      url: { favicon },
      type: "image/ico",
    },
    shortcut: { url: "/favicon.ico", type: "image/ico" },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" />
        <NextTopLoader />
        {children}
      </body>
    </html>
  );
}
