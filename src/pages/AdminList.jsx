import { useEffect, useState } from "react";
import { supabase, STORES } from "../lib/supabase";

// NOTE: This is a lightweight shared-password gate, good enough for an
// internal tool used by a handful of staff. If this needs real per-person
// login later, swap this for the Clerk + Google OAuth pattern used on
// dashboard.dctb.my.
export default function AdminList() {
  const [authed, setAuthed] = useState(
    sessionStorage.getItem("dctb_einvoice_admin") === "1"
  );
  const [pw, setPw] = useState("");

  function tryLogin(e) {
    e.preventDefault();
    if (pw === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem("dctb_einvoice_admin", "1");
      setAuthed(true);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-ink text-white flex items-center justify-center px-4">
        <form
          onSubmit={tryLogin}
          className="w-full max-w-xs bg-panel border border-line rounded-2xl p-6 space-y-4"
        >
          <h1 className="text-lg font-bold">Staff login</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="w-full bg-ink border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
          />
          <button className="w-full bg-accent text-black font-bold py-3 rounded-xl">
            Enter
          </button>
        </form>
      </div>
    );
  }

  return <Dashboard />;
}

function Dashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeFilter, setStoreFilter] = useState("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("einvoice_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRows(data || []);
    setLoading(false);
  }

  async function markIssued(id) {
    await supabase
      .from("einvoice_requests")
      .update({ status: "issued" })
      .eq("id", id);
    load();
  }

  const filtered =
    storeFilter === "all" ? rows : rows.filter((r) => r.store === storeFilter);

  return (
    <div className="min-h-screen bg-ink text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">E-Invoice Requests</h1>
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="bg-panel border border-line rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All stores</option>
            {Object.entries(STORES).map(([code, name]) => (
              <option key={code} value={code}>
                {code} — {name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-sm">No requests yet.</p>
        ) : (
          <div className="overflow-x-auto border border-line rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-panel text-gray-400 text-left">
                <tr>
                  <th className="p-3">Store</th>
                  <th className="p-3">Receipt</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">TIN / ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-line">
                    <td className="p-3">{r.store}</td>
                    <td className="p-3 font-mono">{r.receipt_no}</td>
                    <td className="p-3 font-mono">
                      {r.amount ? `RM ${Number(r.amount).toFixed(2)}` : "-"}
                    </td>
                    <td className="p-3">{r.name}</td>
                    <td className="p-3 font-mono">
                      {r.tin || r.id_number || "-"}
                    </td>
                    <td className="p-3">{r.email}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          r.status === "issued"
                            ? "bg-accent/20 text-accent"
                            : "bg-yellow-900/40 text-yellow-400"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {r.status !== "issued" && (
                        <button
                          onClick={() => markIssued(r.id)}
                          className="text-xs text-accent underline"
                        >
                          Mark issued
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
