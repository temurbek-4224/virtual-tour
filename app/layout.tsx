import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Virtual Tour Uzbekistan",
    template: "%s | Virtual Tour Uzbekistan",
  },
  description:
    "Explore famous tourist attractions of Uzbekistan through an immersive virtual tour experience.",
  keywords: ["Uzbekistan", "virtual tour", "tourism", "Samarkand", "Bukhara", "Khiva"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: LangSetter updates lang client-side per locale
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
