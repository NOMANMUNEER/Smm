"use client";

import Link from "next/link";
import styles from "./MobileSidebar.module.css";

export default function MobileSidebar({ isOpen, onClose, links, user, pathname }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className={styles.userName}>{user?.userName || "User"}</p>
              <p className={styles.userEmail}>{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {user?.role !== "admin" && (
          <div className={styles.balanceCard}>
            <span className={styles.balanceLabel}>Balance</span>
            <span className={styles.balanceValue}>₨{user?.balance?.toFixed(2) || "0.00"}</span>
          </div>
        )}

        <nav className={styles.nav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
              onClick={onClose}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.footer}>
          <button className={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
