import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const metadata = {
  title: "Absensi PKL & Magang",
  description: "Aplikasi absensi siswa PKL dengan fitur deteksi lokasi dan foto wajah.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="id">
      <body>
        <Providers>
          {session?.user && <Navbar role={session.user.role} />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
