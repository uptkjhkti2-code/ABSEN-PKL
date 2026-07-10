import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Absensi PKL & Magang",
  description: "Aplikasi absensi siswa PKL dengan fitur deteksi lokasi dan foto wajah.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
