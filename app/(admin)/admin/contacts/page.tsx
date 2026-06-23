"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEnvelopeOpen, faCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import type { ContactSubmission } from "@/types";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  useEffect(() => { fetchContacts(); }, []);

  async function fetchContacts() {
    const res = await fetch("/api/admin/contacts");
    if (res.ok) setContacts(await res.json());
    setLoading(false);
  }

  async function markRead(id: string) {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_read: true }),
    });
    toast.success("Marked as read");
    fetchContacts();
  }

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* List */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="px-4 py-8 text-center text-gray-400 text-xs">Loading...</div>
            ) : contacts.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-xs">No submissions yet</div>
            ) : contacts.map((c) => (
              <div
                key={c.id}
                onClick={() => { setSelected(c); if (!c.is_read) markRead(c.id); }}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50/80 transition-colors flex items-start gap-3 ${
                  selected?.id === c.id ? "bg-emerald-50/50" : ""
                } ${!c.is_read ? "bg-blue-50/30" : ""}`}
              >
                <FontAwesomeIcon
                  icon={c.is_read ? faEnvelopeOpen : faEnvelope}
                  className={`w-3.5 h-3.5 mt-1 flex-shrink-0 ${c.is_read ? "text-gray-300" : "text-blue-500"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate ${c.is_read ? "text-gray-600" : "text-gray-900 font-semibold"}`}>
                      {c.full_name}
                    </p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">{c.email}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 h-fit sticky top-20">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900">{selected.full_name}</h2>
                {!selected.is_read && (
                  <button
                    onClick={() => markRead(selected.id)}
                    className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3" /> Mark Read
                  </button>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <p><span className="text-gray-400">Email:</span> <span className="text-gray-700">{selected.email}</span></p>
                {selected.phone && <p><span className="text-gray-400">Phone:</span> <span className="text-gray-700">{selected.phone}</span></p>}
                <p><span className="text-gray-400">Date:</span> <span className="text-gray-700">{formatDate(selected.created_at)}</span></p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 text-xs py-8">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
