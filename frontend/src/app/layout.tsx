import {
  DM_Sans,
  Inter,
  Lato,
  Lexend_Deca,
  Nunito,
  Nunito_Sans,
  Open_Sans,
} from "next/font/google";
import "./globals.css";
import SotoreInitor from "@/components/store-initor";
import { Toaster } from "@/components/ui/toaster";
import AppContent from "./app-content";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "Neptune Privacy Explorer",
};

const lexendDeca = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const LocaleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={"en"} className="h-full" data-theme="light">
      <body className={lexendDeca.className}>
        <GoogleAnalytics gaId="G-46NL8XKNWG" />
        <SotoreInitor>
          <Toaster />
          <AppContent>{children}</AppContent>
        </SotoreInitor>
      </body>
    </html>
  );
};

export default LocaleLayout;
