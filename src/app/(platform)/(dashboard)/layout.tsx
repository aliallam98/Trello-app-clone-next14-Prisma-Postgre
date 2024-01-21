import DashboardNavbar from "@/components/navbars/dashboardnavbar/DashboardNavbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardNavbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
