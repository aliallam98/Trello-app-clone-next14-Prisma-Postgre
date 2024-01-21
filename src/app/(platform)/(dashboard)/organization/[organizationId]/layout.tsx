import OrgActiveHandler from "@/components/dashboard/OrgActiveHandler";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

const OrganizationIdPage = ({
  children: children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className=" flex max-w-6xl 2xl:max-w-screen-xl ">
      <OrgActiveHandler />
      <div className="w-64 shrink-0 hidden md:block border-r">
        <Sidebar />
      </div>
      {children}
    </main>
  );
};

export default OrganizationIdPage;
