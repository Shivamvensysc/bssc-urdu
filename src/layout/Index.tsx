import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Index = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <header className="shrink-0">
        <Header />
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Fixed Footer */}
      <footer className="shrink-0">
        <Footer />
      </footer>
    </div>
  );
};

export default Index;