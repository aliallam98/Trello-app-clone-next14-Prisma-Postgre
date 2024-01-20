import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

import Link from "next/link";
import { Spinner } from "../Spinner";
import NavMobLinks from "./NavMobLinks";
import { Button } from "../ui/button";

const UserButtons = () => {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="flex items-center gap-x-2">
      <SignedIn>
        {!isLoaded ? (
          <Spinner size={"default"} />
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </SignedIn>
      <SignedOut>
        <Link href={"/sign-in"}>
          <Button
          variant={"ghost"}
          className="hover:bg-primary/5"
          >Login</Button>
        </Link>
      </SignedOut>

      <NavMobLinks />
    </div>
  );
};

export default UserButtons;
