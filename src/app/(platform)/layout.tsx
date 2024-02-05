import CardModelProvider from "@/providers/CardModelProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster, toast } from "sonner";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster position="bottom-center" />
        <CardModelProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;
