import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Product } from "@/components/ProductCard";

interface CompareContextType {
  compareIds: string[];
  isInCompare: (id: string) => boolean;
  toggleCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

const STORAGE_KEY = "onyxia_compare";

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setCompareIds(raw ? JSON.parse(raw) : []);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
    } catch {}
  }, [compareIds]);

  const isInCompare = (id: string) => compareIds.includes(id);
  const toggleCompare = (product: Product) => {
    setCompareIds((prev) => (prev.includes(product.id) ? prev.filter((x) => x !== product.id) : [...prev, product.id].slice(0, 4)));
  };
  const removeFromCompare = (id: string) => setCompareIds((prev) => prev.filter((x) => x !== id));
  const clearCompare = () => setCompareIds([]);

  const value = useMemo(() => ({ compareIds, isInCompare, toggleCompare, removeFromCompare, clearCompare }), [compareIds]);
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};


