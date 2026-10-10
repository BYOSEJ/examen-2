import type { Metadata } from "next"; import "./globals.css"; import { Toaster } from "sonner";
export const metadata: Metadata = { title: "SIGER | Residencias Profesionales", description: "Sistema Inteligente de Gestión de Residencias Profesionales" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="es"><body>{children}<Toaster richColors position="top-right" /></body></html>; }
