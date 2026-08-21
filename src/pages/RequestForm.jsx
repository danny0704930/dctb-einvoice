import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, Building2, User, ChevronRight, Check } from "lucide-react";
import { supabase, STORES } from "../lib/supabase";

export default function RequestForm() {
  const [params] = useSearchParams();

  // These come straight from the QR code printed on the receipt.
  // e.g. /e/request?store=C1&receipt=20260820-0034&amount=168.00
  const store = params.get("store") || "";
  const receipt = params.get("receipt") || "";
  const amount = params.get("amount") || "";

  const storeName = STORES[store] || store;

  const [entityType, setEntityType] = useState("business");
  const [idType, setIdType] = useState("nric");
  const [form, setForm] = useState({
    name: "",
    tin: "",
    idNumber: "", // BRN (business) or NRIC/Passport (individual)
    sstNo: "",
    email: "",
    phone: "",
    address: "",
    postcode: "",
    city: "",
    state: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [errorMsg, setErrorMsg] = useState("");

  const missingContext = !store || !receipt;

  const idLabel = useMemo(() => {
    if (entityType === "business") return "Business Reg. No. (BRN/SSM)";
    return idType === "nric" ? "NRIC No." : "Passport No.";
  }, [entityType, idType]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email) {
      setErrorMsg("Please fill in the required fields.");
      return;
    }
    if (!form.tin && !form.idNumber) {
      setErrorMsg("Enter at least a Tax ID (TIN) or an ID/BRN number.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const { error } = await supabase.from("einvoice_requests").insert({
      store,
      receipt_no: receipt,
      amount: amount ? Number(amount) : null,
      entity_type: entityType,
      id_type: entityType === "individual" ? idType : "brn",
      name: form.name,
      tin: form.tin || null,
      id_number: form.idNumber || null,
      sst_no: form.sstNo || null,
      email: form.email,
      phone: form.phone || null,
      address: form.address || null,
      postcode: form.postcode || null,
      city: form.city || null,
      state: form.state || null,
      status: "pending",
    });

    if (error) {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or contact the store.");
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="min-h-screen bg-ink text-white flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
          <Check className="text-black" size={28} />
        </div>
        <h1 className="text-xl font-bold mb-2">Request received</h1>
        <p className="text-gray-400 text-sm text-center max-w-xs">
          We'll email your e-invoice to {form.email} once it's issued.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-white flex flex-col items-center py-10 px-4">
      <div className="text-center max-w-sm w-full mb-8">
        <p className="text-accent text-xs font-bold tracking-[0.15em] mb-3">
          E-INVOICE REQUEST
        </p>
        <h1 className="text-3xl font-extrabold mb-3 leading-tight">
          DCTB Smart Home
        </h1>
        {storeName && <p className="text-gray-400 text-sm">{storeName}</p>}
        {receipt && <p className="text-gray-400 text-sm">Receipt {receipt}</p>}
        {amount && (
          <p className="font-mono text-sm font-bold mt-1">
            Total RM {Number(amount).toFixed(2)}
          </p>
        )}
      </div>

      {missingContext && (
        <div className="w-full max-w-sm bg-yellow-950/40 border border-yellow-700/50 text-yellow-300 text-xs rounded-xl p-3 mb-4">
          This link is missing store/receipt info. Please scan the QR code on
          your receipt directly, or ask staff for help.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-panel border border-line rounded-2xl p-6 space-y-6"
      >
        <div>
          <label className="text-sm font-semibold block mb-2">
            Requesting as <span className="text-accent">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 bg-ink p-1 rounded-xl border border-line">
            <ToggleButton
              active={entityType === "business"}
              onClick={() => setEntityType("business")}
              icon={<Building2 size={16} />}
              label="Business"
            />
            <ToggleButton
              active={entityType === "individual"}
              onClick={() => setEntityType("individual")}
              icon={<User size={16} />}
              label="Individual"
            />
          </div>
        </div>

        <Field
          label={entityType === "business" ? "Company Name" : "Full Name"}
          required
          value={form.name}
          onChange={(v) => update("name", v)}
          placeholder={
            entityType === "business" ? "e.g. ABC Sdn Bhd" : "e.g. Jane Tan"
          }
        />

        {entityType === "business" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Tax ID (TIN)"
                mono
                value={form.tin}
                onChange={(v) => update("tin", v)}
                placeholder="C1234567890"
              />
              <Field
                label="Business Reg. No."
                mono
                value={form.idNumber}
                onChange={(v) => update("idNumber", v)}
                placeholder="SSM no."
              />
            </div>
            <Hint text="Enter at least one — TIN preferred. BRN is your SSM registration number." />
          </>
        ) : (
          <>
            <Field
              label="Tax ID (TIN)"
              optional
              mono
              value={form.tin}
              onChange={(v) => update("tin", v)}
              placeholder="IG1234567890"
            />

            <div>
              <label className="text-sm font-semibold block mb-2">
                ID Type <span className="text-accent">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 bg-ink p-1 rounded-xl border border-line">
                <ToggleButton
                  active={idType === "nric"}
                  onClick={() => setIdType("nric")}
                  label="NRIC"
                />
                <ToggleButton
                  active={idType === "passport"}
                  onClick={() => setIdType("passport")}
                  label="Passport"
                />
              </div>
            </div>

            <Field
              label={idLabel}
              required
              mono
              value={form.idNumber}
              onChange={(v) => update("idNumber", v)}
              placeholder={
                idType === "nric" ? "e.g. 900101-01-1234" : "e.g. A12345678"
              }
            />
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Email"
            required
            value={form.email}
            onChange={(v) => update("email", v)}
            placeholder="you@company.com"
          />
          <Field
            label="SST No."
            optional
            mono
            value={form.sstNo}
            onChange={(v) => update("sstNo", v)}
            placeholder="If SST-registered"
          />
        </div>

        <Field
          label="Phone"
          optional
          mono
          value={form.phone}
          onChange={(v) => update("phone", v)}
          placeholder="e.g. 0123456789"
        />

        <Field
          label="Address"
          optional
          value={form.address}
          onChange={(v) => update("address", v)}
          placeholder="Street address"
        />

        <div className="grid grid-cols-3 gap-3">
          <Field
            label="Postcode"
            mono
            value={form.postcode}
            onChange={(v) => update("postcode", v)}
            placeholder="50000"
          />
          <Field
            label="City"
            value={form.city}
            onChange={(v) => update("city", v)}
            placeholder="Kuala Lumpur"
          />
          <Field
            label="State"
            value={form.state}
            onChange={(v) => update("state", v)}
            placeholder="Selangor"
          />
        </div>

        {errorMsg && (
          <p className="text-red-400 text-xs -mt-2">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-accent hover:bg-accentDark disabled:opacity-60 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
        >
          <FileText size={18} />
          {status === "submitting" ? "Submitting..." : "Request E-Invoice"}
          <ChevronRight size={16} />
        </button>
      </form>

      <p className="text-gray-600 text-xs tracking-widest mt-8">
        POWERED BY DCTB
      </p>
    </div>
  );
}

function ToggleButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        active ? "bg-accent text-black" : "text-gray-400 hover:text-white"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Field({ label, required, optional, mono, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-semibold block mb-2">
        {label} {required && <span className="text-accent">*</span>}
        {optional && (
          <span className="text-gray-500 font-normal">(optional)</span>
        )}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-ink border border-line rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-accent transition-colors ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}

function Hint({ text }) {
  return (
    <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wide">
      {text}
    </p>
  );
}
