"use client";

import { useState } from "react";
import EnquireForm from "./EnquireForm";

export default function FloatingEnquireButton({ sourcePage }: { sourcePage: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-0 z-40 origin-bottom-right rounded-t-md bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 sm:-rotate-90 sm:right-0 sm:bottom-1/3"
      >
        Enquire Now →
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-primary">Enquire Now</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <EnquireForm sourcePage={sourcePage} />
          </div>
        </div>
      )}
    </>
  );
}
