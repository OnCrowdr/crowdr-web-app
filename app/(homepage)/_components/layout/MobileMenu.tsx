"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { email } from "../../../../utils/openEmail";
import "./component-styles/mobile-menu.css";

type Props = {
  openModal?: () => void;
};

export default function MobileMenu({ openModal }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();
  const router = useRouter();

  const isActive = (pathname: string) => {
    return currentPath === pathname ? "active" : "";
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  return (
    <div className="mobile-menu">
      <div className="container">
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? (
            <IoMdClose size={25} />
          ) : (
            <Image width={25} height={25} src="/svg/new-menu.svg" alt="menu" />
          )}
        </div>
      </div>
      <div className={`menu ${isOpen ? "open" : ""}`} onClick={closeMenu}>
        <ul>
          <li>
            <Link href="/about" className={isActive("/about")}>
              About
            </Link>
          </li>
          <li>
            <a href="https://blog.oncrowdr.com" target="_blank">
              Blog
            </a>
          </li>
          <li>
            <Link href="/pricing" className={isActive("/pricing")}>
              Pricing
            </Link>
          </li>
          <li>
            <a href={`mailto:${email}`} target="_blank">
              Contact us
            </a>
          </li>
          <li>
            <Link href="/login" className={isActive("/login")}>
              Log In
            </Link>
          </li>
          <li>
            <button
              className="btn-outline w-100"
              onClick={() => router.push("signup")}>
              Start a Campaign
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
