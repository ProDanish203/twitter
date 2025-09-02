import { cn } from "@/lib/utils";
import Link from "next/link";

export const BottomLinks = () => {
  const footerLinks = [
    { label: "About", href: "#" },
    { label: "Download the X app", href: "#" },
    { label: "Grok", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Accessibility", href: "#" },
    { label: "Ads Info", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Brand Resources", href: "#" },
    { label: "Advertising", href: "#" },
    { label: "Marketing", href: "#" },
    { label: "X for Business", href: "#" },
    { label: "Developers", href: "#" },
    { label: "Directory", href: "#" },
    { label: "Settings", href: "#" },
    { label: `@${new Date().getFullYear()} X Corp.`, href: "#" },
  ];
  return (
    <nav className="w-screen flex flex-wrap items-center justify-center gap-2 py-3 px-4">
      {footerLinks.map((link, idx) => (
        <div
          key={idx}
          className={cn(
            idx !== 0 && "border-l border-l-[#71767b]/50 pl-2 leading-4"
          )}
        >
          <Link href={link.href} className="">
            <span className="break-normal text-[#71767b] text-start text-[12px] hover:underline">
              {link.label}
            </span>
          </Link>
        </div>
      ))}
    </nav>
  );
};
