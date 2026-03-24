"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      setAuthChecked(true);
    });
  }, [isLoginPage, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <p className="text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-card">
      <header className="border-b border-border bg-background px-4 py-3 flex items-center justify-between gap-4">
        <nav className="flex items-center gap-4 flex-wrap">
          <Link
            href="/admin"
            className="font-medium text-foreground hover:text-primary"
          >
            Tableau de bord
          </Link>
          <Link
            href="/admin/concerts"
            className="font-medium text-foreground hover:text-primary"
          >
            Concerts
          </Link>
          <Link
            href="/admin/singles"
            className="font-medium text-foreground hover:text-primary"
          >
            Singles
          </Link>
          <Link
            href="/admin/albums"
            className="font-medium text-foreground hover:text-primary"
          >
            Albums
          </Link>
          <Link
            href="/admin/modals"
            className="font-medium text-foreground hover:text-primary"
          >
            Modals
          </Link>
          <Link
            href="/admin/press"
            className="font-medium text-foreground hover:text-primary"
          >
            Presse
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Site
          </Link>
        </nav>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Déconnexion
        </Button>
      </header>
      <main>{children}</main>
    </div>
  );
}
