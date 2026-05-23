import "./globals.css";
import Provider from "./Provider";
export const metadata = {
  title: "Apix — API Builder",
  description: "Build REST & GraphQL APIs in minutes",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><Provider>{children}</Provider></body>
    </html>
  );
}
