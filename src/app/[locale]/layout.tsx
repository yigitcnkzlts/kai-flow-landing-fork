import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Footer from "@/components/footer";
import "../globals.css";
import { HeroHeader } from "@/components/header";
import { DemoModalProvider } from "@/components/demo-modal-provider";

export const metadata = {
  title: "Kai Flow - Visual Workflow Automation Platform",
  description:
    "Build and automate your workflows effortlessly with Kai Flow. A powerful visual tool to connect APIs, automate tasks, and streamline processes — no coding required.",
  keywords: [
    "workflow automation",
    "visual editor",
    "drag and drop",
    "low code",
    "automation tool",
    "api integration",
    "task automation",
    "Kai Flow",
    "n8n alternative",
    "next.js automation app",
  ],
  authors: [
    { name: "Doganay Balaban", url: "https://github.com/DoganayBalaban" },
  ],
  creator: "Doganay Balaban",
  metadataBase: new URL("https://kai-fusion.vercel.app"),
  openGraph: {
    title: "Kai Flow - Visual Workflow Builder",
    description:
      "Create automated workflows with a powerful and intuitive visual interface. Connect services, manage variables, and streamline your operations.",
    url: "https://kai-fusion.vercel.app",
    siteName: "Kai Flow",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Kai Flow - Visual Workflow Builder",
    description:
      "Drag-and-drop automation platform to streamline your tasks and services.",
    creator: "@kafein",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <DemoModalProvider>
            <HeroHeader />
            {children}
            <Footer />
          </DemoModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
