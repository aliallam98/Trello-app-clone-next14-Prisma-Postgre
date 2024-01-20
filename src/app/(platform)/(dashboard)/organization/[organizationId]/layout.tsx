import OrgActiveHandler from "@/components/dashboard/OrgActiveHandler";

const OrganizationIdPage = ({ children: children }: { children: React.ReactNode }) => {
    return (
        <main>
            <OrgActiveHandler/>
            {children}</main>
    )
};

export default OrganizationIdPage
