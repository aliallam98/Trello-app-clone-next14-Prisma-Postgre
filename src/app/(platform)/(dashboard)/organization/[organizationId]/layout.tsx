import OrgActiveHandler from "@/components/dashboard/OrgActiveHandler";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

const OrganizationIdPage = ({
  children: children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <OrgActiveHandler />
      <div className="flex h-full">
        <Sidebar />
        <div className="grow p-4">
        {children}
        </div>
      </div>
    </>
  );
};

export default OrganizationIdPage;
