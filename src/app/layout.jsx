import "./globals.css";
import ReduxProvider from "../store/ReduxProvider";
import Sidebar from "../Components/Common/Sidebar";

export const metadata = {
  title: "Dashboard App",
  description: "Modern dashboard layout",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <ReduxProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
