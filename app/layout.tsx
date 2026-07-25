import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZIVA G — Artisanal Broths & Culinary Soups",
  description: "Elevating comfort food into a luxury culinary ritual. 18-hour copper-kettle simmered organic broths delivered in eco-insulated glass jars.",
  keywords: ["Ziva G", "Artisanal Broth", "Bone Broth", "Organic Soup", "Copper Kettle", "Gourmet Culinary"],
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
        {children}
      </body>
    </html>
  );

  if (publishableKey) {
    return (
      <ClerkProvider
        publishableKey={publishableKey}
        appearance={{
          baseTheme: dark,
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
