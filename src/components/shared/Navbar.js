"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import MobileSidebar from "./MobileSidebar";

export default function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = user?.role === "admin";

  const navLinks = isAdmin
    ? [
        { href: "/admin/manage-services", label: "Services", icon: "⚙️" },
        { href: "/admin/all-orders", label: "All Orders", icon: "📦" },
      ]
    : [
        { href: "/new-order", label: "New Order", icon: "🛒" },
        { href: "/orders", label: "My Orders", icon: "📋" },
      ];

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href={isAdmin ? "/admin/all-orders" : "/new-order"} className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>SMM<span className={styles.logoAccent}>Panel</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className={styles.desktopNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
              >
                <span className={styles.navIcon}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className={styles.right}>
            {!isAdmin && (
              <div className={styles.balance}>
                <span className={styles.balanceLabel}>Balance</span>
                <span className={styles.balanceValue}>₨{user?.balance?.toFixed(2) || "0.00"}</span>
              </div>
            )}

            <div className={styles.avatar}>
              {user?.userName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
        user={user}
        pathname={pathname}
      />
    </>
  );
}
