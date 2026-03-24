"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

export type AdminMenuAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type AdminCursorMenuProps = {
  open: boolean;
  x: number;
  y: number;
  actions: AdminMenuAction[];
  onClose: () => void;
};

/**
 * Petit menu fixé près du clic (admin), pour modifier un élément sans bouton « + ».
 */
export function AdminCursorMenu({
  open,
  x,
  y,
  actions,
  onClose,
}: AdminCursorMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x + 12, top: y + 12 });

  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const pad = 8;
    let left = x + 12;
    let top = y + 12;
    if (left + rect.width > window.innerWidth - pad) {
      left = window.innerWidth - rect.width - pad;
    }
    if (top + rect.height > window.innerHeight - pad) {
      top = window.innerHeight - rect.height - pad;
    }
    left = Math.max(pad, left);
    top = Math.max(pad, top);
    setPos({ left, top });
  }, [open, x, y, actions]);

  useLayoutEffect(() => {
    if (!open) return;
    const handleDown = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const t = window.setTimeout(() => {
      document.addEventListener("mousedown", handleDown, true);
      document.addEventListener("keydown", handleKey);
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("mousedown", handleDown, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={ref}
      role="menu"
      className="fixed z-[300] min-w-[188px] rounded-lg border border-border bg-popover text-popover-foreground shadow-xl py-1 font-sans"
      style={{ left: pos.left, top: pos.top }}
    >
      {actions.map((a, i) => {
        const className =
          "block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors";
        if (a.href) {
          return (
            <Link
              key={i}
              href={a.href}
              role="menuitem"
              className={className}
              onClick={onClose}
            >
              {a.label}
            </Link>
          );
        }
        return (
          <button
            key={i}
            type="button"
            role="menuitem"
            className={className}
            onClick={() => {
              a.onClick?.();
              onClose();
            }}
          >
            {a.label}
          </button>
        );
      })}
    </div>,
    document.body
  );
}
