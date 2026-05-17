"use client";

import Navbar from "@/components/shared/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role === "admin") {
      router.push("/admin/all-orders");
      return;
    }
    setUser(parsed);
  }, [router]);

  if (!user) return null;

  return (
    <>
      <Navbar user={user} />
      <main style={{ padding: "1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        {children}
      </main>
    </>
  );
}
