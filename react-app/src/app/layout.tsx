import './globals.css';
export const metadata = { title: 'OPS Data Marketplace', description: 'Ontario Public Service Data Product Catalog' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
