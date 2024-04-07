"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import GoogleTranslateWidget from "@/components/GoogleTranslate";

export default function CustomerNavbar({ links }) {
  const pathname = usePathname();
  return (
    <nav className="flex w-full h-[5rem] bg-white shadow-md">
      <div className="flex w-full h-full justify-between items-center px-6 font-bold [&>*>li]:relative">
        <ul className="flex flex-row gap-8 items-center">
          <li>
              <Image src={"./logo.svg"} width={24} height={24}></Image>
          </li>
          {links.map((link) => (
            <li key={link.route}>
              <Link
                className={
                  pathname === link.route ? "nav-link-active" : "nav-link"
                }
                href={link.route}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-row gap-8 items-center">
          <GoogleTranslateWidget />
          <li>
            <Link href={"/employee/burgers"}>
              <Image className="nav-image" src={"./user.svg"} width={24} height={24}></Image>
            </Link>
          </li>
          <li>
            <Link href={"/cart"}>
              <Image className="nav-image" src={"./cart.svg"} width={24} height={24}></Image>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
