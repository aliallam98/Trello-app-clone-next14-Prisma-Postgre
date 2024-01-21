import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbars/marketingnavbar/Navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full pt-40 bg-slate-100">
      {/* <Navbar/> */}
      {children}
      <Footer />
    </main>
  );
};

export default MarketingLayout;
