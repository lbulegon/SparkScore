"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sparkscore_launch_checklist_v1";

export type CheckItem = { id: string; label: string };

export function useLaunchChecklist(items: CheckItem[]) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      setChecked({});
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setChecked({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const total = items.length;
  const done = items.filter((i) => checked[i.id]).length;

  return { checked, toggle, reset, done, total };
}
