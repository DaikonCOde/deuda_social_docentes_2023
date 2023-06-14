import "./globals.css";
import { Space_Mono } from "next/font/google";

const space_mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata = {
  title: "Deuda Social DOcentes - 2023",
  description:
    "Lugar donde podras saber si es que eres beneficiario de la deuda social a docentes 2023",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={space_mono.className}>{children}</body>
    </html>
  );
}
