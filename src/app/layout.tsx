import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online Smoke",
  description: "AR 담배 시뮬레이터 - 웹캠으로 담배피기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
