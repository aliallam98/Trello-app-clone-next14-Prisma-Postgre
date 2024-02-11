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
      <div className="flex gap-x-4 h-full">
        <div className="w-64 shrink-0 hidden md:block h-full">
          <Sidebar />
        </div>
        <div className="grow p-4">{children}</div>
      </div>
    </>
  );
};

export default OrganizationIdPage;
