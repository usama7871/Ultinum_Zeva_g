import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { CartProvider } from "@/context/CartContext";
import { UserActivityProvider } from "@/context/UserActivityContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZEVA JEE™ — Botanical Soap Collection",
  description: "Discover ZEVA JEE™ handcrafted botanical soaps inspired by nature, made with premium ingredients for daily skincare.",
  keywords: ["ZEVA JEE", "Botanical Soap", "Handmade Soap", "Organic Skincare", "Natural Ingredients", "Soap Collection"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-stone-950 text-amber-50 selection:bg-amber-500 selection:text-stone-900">
        <CartProvider>
          <UserActivityProvider>
            {children}
          </UserActivityProvider>
        </CartProvider>
      </body>
    </html>
  );

  if (publishableKey) {
    return (
      <ClerkProvider
        publishableKey={publishableKey}
        appearance={{
          theme: dark,
          variables: {
            colorPrimary: "#f59e0b",
            colorBackground: "#1c1917",
          },
        }}
      >
        {content}
      </ClerkProvider>
    );
  }

  return content;
}
