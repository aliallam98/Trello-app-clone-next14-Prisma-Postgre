import { ClerkProvider } from "@clerk/nextjs";
import { Toaster, toast } from "sonner";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <Toaster position="bottom-center"/>
      {children}
    </ClerkProvider>
  );
};

export default PlatformLayout;
