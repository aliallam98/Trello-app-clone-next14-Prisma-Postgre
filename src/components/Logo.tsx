import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"}>
      <Image
        alt="Logo"
        width={40}
        height={30}
        src={"/logo.svg"}
      />
    </Link>
  );
};

export default Logo;
