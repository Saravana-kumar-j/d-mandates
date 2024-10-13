// layout.jsx
import { Poppins } from "next/font/google"; // Import Poppins font
import "./globals.css"; // Ensure this is imported

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Specify weights you want to use
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
