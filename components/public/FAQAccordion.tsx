"use client";

import { useState } from "react";
import type { Tables } from "@/types/database.types";
import Markdown from "@/components/Markdown";

type FaqItem = Tables<"faq_items">;

export default function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!items.length) {
    return <p className="text-sm text-gray-500">FAQs coming soon.</p>;
  }

  return (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
      {items
        .sort((a, b) => a.position - b.position)
        .map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900"
              >
                {item.question}
                <span className="ml-4 text-brand-primary">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm text-gray-600">
                  <Markdown>{item.answer_markdown}</Markdown>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
