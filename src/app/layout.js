import "./globals.css";

export const metadata = {
  title: "SMM Panel — Social Media Marketing Dashboard",
  description:
    "Affordable social media marketing services. Order Instagram followers, YouTube views, TikTok likes, and more through our automated SMM panel.",
  keywords: "SMM panel, social media marketing, buy followers, buy likes, buy views",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
