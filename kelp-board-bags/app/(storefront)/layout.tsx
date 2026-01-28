import { Header } from "@/components/storefront/Header"
// import { Footer } from "@/components/storefront/Footer"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {/* <Footer /> */}
      <footer className="bg-gray-100 p-4 text-center text-sm">
        © 2026 Kelp Board Bags
      </footer>
    </div>
  )
}
