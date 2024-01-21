import DashboardNavbar from "@/components/navbars/dashboardnavbar/DashboardNavbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashboardNavbar />
      <main className="h-full">{children}</main>
    </>
  );
};

export default DashboardLayout;
