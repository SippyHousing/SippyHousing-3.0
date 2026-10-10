import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, Mail, MessageCircle, Phone, Trash2, RefreshCw, Loader2, Inbox } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { enquiryService, Enquiry, EnquiryStatus } from "@/services/enquiryService";
import { normalizeIndianPhone } from "@/lib/contactRouting";

const STATUSES: EnquiryStatus[] = ["New", "Contacted", "Closed"];

const statusStyle: Record<EnquiryStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  Closed: "bg-green-100 text-green-700",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

const Enquiries = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | EnquiryStatus>("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [warning, setWarning] = useState<string | undefined>();

  const load = async () => {
    setLoading(true);
    try {
      const { items: all, warning: w } = await enquiryService.getAllEnquiries();
      setItems(all);
      setWarning(w);
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Could not load enquiries", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromT = from ? new Date(from + "T00:00:00").getTime() : null;
    const toT = to ? new Date(to + "T23:59:59").getTime() : null;
    return items.filter((e) => {
      if (status !== "All" && e.status !== status) return false;
      const t = new Date(e.created_at).getTime();
      if (fromT && t < fromT) return false;
      if (toT && t > toT) return false;
      if (!q) return true;
      return [e.full_name, e.phone_number, e.email, e.interest_area, e.message].some((v) => (v || "").toLowerCase().includes(q));
    });
  }, [items, search, status, from, to]);

  const counts = useMemo(() => ({
    total: items.length,
    New: items.filter((e) => e.status === "New").length,
    Contacted: items.filter((e) => e.status === "Contacted").length,
    Closed: items.filter((e) => e.status === "Closed").length,
  }), [items]);

  const downloadReport = () => {
    if (!filtered.length) {
      toast({ title: "Nothing to download", description: "No enquiries match the current filters." });
      return;
    }
    const head = ["Sr No", "Date & Time", "Name", "Phone", "Email", "Interested In", "Message", "Status", "Notes", "Source"];
    const rows = filtered.map((e, i) => [
      i + 1, fmt(e.created_at), e.full_name, e.phone_number, e.email || "", e.interest_area,
      e.message || "", e.status, e.admin_notes || "", e.source || "",
    ]);
    // BOM so Excel shows ₹ / non-English characters correctly
    const csv = "\uFEFF" + [head, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `sippy-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const changeStatus = async (id: string, s: EnquiryStatus) => {
    try {
      await enquiryService.updateEnquiry(id, { status: s });
      setItems((prev) => prev.map((e) => (e.id === id ? { ...e, status: s } : e)));
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Update failed", variant: "destructive" });
    }
  };

  const saveNote = async (id: string, note: string) => {
    try {
      await enquiryService.updateEnquiry(id, { admin_notes: note });
      setItems((prev) => prev.map((e) => (e.id === id ? { ...e, admin_notes: note } : e)));
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Could not save note", variant: "destructive" });
    }
  };

  const remove = async (id: string, legacy?: boolean) => {
    if (!window.confirm("Delete this enquiry? This cannot be undone.")) return;
    try {
      await enquiryService.deleteEnquiry(id, legacy);
      setItems((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" });
    }
  };

  const waLink = (e: Enquiry) =>
    `https://wa.me/91${normalizeIndianPhone(e.phone_number)}?text=${encodeURIComponent(
      `Hello ${e.full_name}, thank you for your enquiry with Sippy Housing regarding ${e.interest_area}. How can we help you?`
    )}`;

  const mailLink = (e: Enquiry) =>
    `mailto:${e.email}?subject=${encodeURIComponent("Your enquiry with Sippy Housing")}&body=${encodeURIComponent(
      `Hello ${e.full_name},\n\nThank you for your enquiry regarding ${e.interest_area}.\n\n`
    )}`;

  return (
    <AdminLayout title="Client Enquiries">
      <Button variant="outline" onClick={() => navigate("/admin")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Client Enquiries
            <span className="ml-3 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">{counts.total} total</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Messages sent through the Contact Us form on your website</p>
        </div>

        {warning && (
          <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-lg p-4 text-sm">
            <strong>Setup needed:</strong> {warning}
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([["Total", counts.total, "text-gray-900"], ["New", counts.New, "text-blue-600"], ["Contacted", counts.Contacted, "text-amber-600"], ["Closed", counts.Closed, "text-green-600"]] as const).map(([label, n, color]) => (
            <div key={label} className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{n}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-4 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-500">Search</label>
            <Input placeholder="Name, phone, email, interest, message…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option>All</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">From</label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500">To</label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <Button variant="outline" onClick={load} title="Refresh"><RefreshCw className="h-4 w-4" /></Button>
          <Button onClick={downloadReport} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" /> Download Report ({filtered.length})
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center text-gray-500">
            <Inbox className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            No enquiries found.
            {items.length === 0 && !warning && (
              <p className="text-xs text-gray-400 mt-3 max-w-md mx-auto">
                Can you see messages in Supabase (Table Editor → enquiries) but not here? Supabase is hiding them
                from the admin login. Run <b>migrations/009_enquiries_repair.sql</b> in the Supabase SQL Editor,
                then log out, log in again and refresh this page.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((e) => (
              <div key={e.id} className="bg-white rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-lg font-extrabold text-amber-800 bg-gradient-to-br from-[#C9A84C] to-[#e8c96d]">
                      {(e.full_name || "?").charAt(0).toUpperCase()}
                    </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{e.full_name}</h3>
                      {e.legacy
                        ? <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Old form</span>
                        : <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[e.status]}`}>{e.status}</span>}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{e.interest_area}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{fmt(e.created_at)}</p>
                  </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`tel:${e.phone_number}`}><Button size="sm" variant="outline"><Phone className="h-4 w-4 mr-1" />{e.phone_number}</Button></a>
                    <a href={waLink(e)} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline" className="text-green-700"><MessageCircle className="h-4 w-4 mr-1" />WhatsApp</Button></a>
                    {e.email && <a href={mailLink(e)}><Button size="sm" variant="outline"><Mail className="h-4 w-4 mr-1" />Email</Button></a>}
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => remove(e.id, e.legacy)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                {e.email && <p className="text-sm text-gray-600 mt-2">{e.email}</p>}
                {e.message && <p className="text-sm text-gray-800 mt-2 whitespace-pre-wrap bg-gray-50 rounded p-3">{e.message}</p>}
                {!e.legacy && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex gap-1">
                    {STATUSES.map((s) => (
                      <button key={s} onClick={() => changeStatus(e.id, s)}
                        className={`text-xs px-3 py-1 rounded-full border ${e.status === s ? statusStyle[s] + " border-transparent font-semibold" : "text-gray-500 hover:bg-gray-50"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <Input
                    defaultValue={e.admin_notes || ""}
                    placeholder="Follow-up note (saved when you click away)"
                    className="h-8 text-xs flex-1 min-w-[220px]"
                    onBlur={(ev) => { if ((ev.target.value || "") !== (e.admin_notes || "")) saveNote(e.id, ev.target.value); }}
                  />
                </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Enquiries;
