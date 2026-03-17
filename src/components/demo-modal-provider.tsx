"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { DemoRequestModal } from "./demo-request-modal";

interface DemoModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const DemoModalContext = createContext<DemoModalContextType | undefined>(
  undefined
);

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <DemoModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <DemoRequestModal isOpen={isOpen} onClose={closeModal} />
    </DemoModalContext.Provider>
  );
}

export function useDemoModal() {
  const context = useContext(DemoModalContext);
  if (!context) {
    throw new Error("useDemoModal must be used within DemoModalProvider");
  }
  return context;
}
