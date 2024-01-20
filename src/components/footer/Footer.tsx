import React from "react";
import Logo from "../Logo";
import { Button } from "../ui/button";

const Footer = () => {
  return (
    <footer className="p-6  border-t">
      <div className="container max-w-[1140px] flex justify-between items-center ">
        <Logo />
        <div className="flex items-center  text-muted-foreground">
          <Button size="sm" variant="ghost">
            Privacy Policy
          </Button>
          <Button size="sm" variant="ghost">
            Terms & Conditions
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
