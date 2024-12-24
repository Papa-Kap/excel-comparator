import { GeistSans } from "geist/font";
import "./globals.css";

// GeistSans is already configured, we don't need to call it as a function
export const metadata = {
  title: "Excel Comparator",
  description: "Compare Excel files efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        {children}
      </body>
    </html>
  );
}