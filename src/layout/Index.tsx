import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Page Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;