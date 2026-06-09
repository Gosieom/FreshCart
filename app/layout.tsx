// app/layout.tsx
import "./globals.css"; // optional, for global styles

export const metadata = {
  title: "FreshCart",
  description: "Fresh groceries delivered to your doorstep",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}