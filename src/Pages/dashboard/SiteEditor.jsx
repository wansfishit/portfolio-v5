import { useEffect, useMemo, useState } from "react";
import { ImagePlus, RotateCcw, Save, Type } from "lucide-react";
import {
  DEFAULT_SITE_CONTENT,
  fetchSiteContent,
  saveSiteContent,
} from "../../data/siteContent";

const SectionCard = ({ title, description, children }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
      {label}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
      {label}
    </label>
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
    />
  </div>
);

export default function SiteEditor() {
  const [content, setContent] = useState(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const home = content.home;
  const about = content.about;

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      setLoading(true);
      const data = await fetchSiteContent();
      if (!mounted) return;
      setContent(data);
      setLoading(false);
    };

    loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  const setHome = (key, value) => {
    setStatus(null);
    setContent((prev) => ({ ...prev, home: { ...prev.home, [key]: value } }));
  };

  const setAbout = (key, value) => {
    setStatus(null);
    setContent((prev) => ({ ...prev, about: { ...prev.about, [key]: value } }));
  };

  const typingWordsText = useMemo(() => home.typingWords.join(", "), [home.typingWords]);
  const techStackText = useMemo(() => home.techStack.join(", "), [home.techStack]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAbout("photo", reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);

    const result = await saveSiteContent(content);
    setContent(result.content);
    setSaving(false);

    if (result.synced) {
      setStatus({
        type: "success",
        message: "Perubahan tersimpan ke Supabase. HP/device lain akan ikut berubah setelah refresh.",
      });
    } else {
      setStatus({
        type: "error",
        message: `Gagal simpan ke Supabase: ${result.error?.message || "unknown error"}. Cek tabel site_content di Supabase.`,
      });
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset semua teks ke default?")) return;

    setSaving(true);
    setStatus(null);
    const result = await saveSiteContent(DEFAULT_SITE_CONTENT);
    setContent(result.content);
    setSaving(false);

    setStatus({
      type: result.synced ? "success" : "error",
      message: result.synced
        ? "Default berhasil disimpan ke Supabase."
        : `Reset lokal berhasil, tapi gagal simpan ke Supabase: ${result.error?.message || "unknown error"}`,
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-gray-300">
        Loading data website dari Supabase...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-50" />
            <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
              <Type className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Edit Website</h1>
            <p className="text-gray-500 text-xs">Ubah teks, link, intro, dan foto profil</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-colors disabled:opacity-60"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="relative group shrink-0 disabled:opacity-60">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur group-hover:opacity-80 transition duration-300" />
            <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[#030014] rounded-xl border border-white/10">
              <Save className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-gray-200">{saving ? "Saving..." : "Save Changes"}</span>
            </div>
          </button>
        </div>
      </div>

      {status && (
        <div
          className={`rounded-xl px-4 py-3 text-sm border ${
            status.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/20 bg-red-500/10 text-red-300"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Home / Intro" description="Teks utama di halaman pertama website">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Badge" value={home.statusBadge} onChange={(v) => setHome("statusBadge", v)} />
            <InputField label="Title Baris 1" value={home.titleLine1} onChange={(v) => setHome("titleLine1", v)} />
            <InputField label="Title Baris 2" value={home.titleLine2} onChange={(v) => setHome("titleLine2", v)} />
            <InputField label="Typing Words" value={typingWordsText} onChange={(v) => setHome("typingWords", v.split(",").map((x) => x.trim()).filter(Boolean))} placeholder="Frontend Developer, UI Designer" />
            <div className="sm:col-span-2">
              <TextAreaField label="Deskripsi Home" value={home.description} onChange={(v) => setHome("description", v)} rows={3} />
            </div>
            <InputField label="Tech Stack" value={techStackText} onChange={(v) => setHome("techStack", v.split(",").map((x) => x.trim()).filter(Boolean))} placeholder="React, Tailwind, Supabase" />
            <InputField label="GitHub URL" value={home.githubUrl} onChange={(v) => setHome("githubUrl", v)} />
            <InputField label="LinkedIn URL" value={home.linkedinUrl} onChange={(v) => setHome("linkedinUrl", v)} />
            <InputField label="Instagram URL" value={home.instagramUrl} onChange={(v) => setHome("instagramUrl", v)} />
          </div>
        </SectionCard>

        <SectionCard title="About Me" description="Teks dan foto di bagian profil">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Judul Section" value={about.heading} onChange={(v) => setAbout("heading", v)} />
            <InputField label="Intro Section" value={about.intro} onChange={(v) => setAbout("intro", v)} />
            <InputField label="Greeting" value={about.greeting} onChange={(v) => setAbout("greeting", v)} />
            <InputField label="Nama" value={about.name} onChange={(v) => setAbout("name", v)} />
            <div className="sm:col-span-2">
              <TextAreaField label="Deskripsi Profil" value={about.description} onChange={(v) => setAbout("description", v)} rows={4} />
            </div>
            <div className="sm:col-span-2">
              <TextAreaField label="Quote" value={about.quote} onChange={(v) => setAbout("quote", v)} rows={2} />
            </div>
            <InputField label="CV URL" value={about.cvUrl} onChange={(v) => setAbout("cvUrl", v)} />
            <InputField label="Tanggal Mulai Experience" type="date" value={about.experienceStartDate} onChange={(v) => setAbout("experienceStartDate", v)} />
          </div>

          <div className="pt-2 space-y-3">
            <label className="text-xs text-indigo-300/70 uppercase tracking-wider font-medium">Foto Profil</label>
            <div className="flex items-center gap-4 flex-wrap">
              <img src={about.photo} alt="Profile preview" className="w-24 h-24 rounded-full object-cover border border-white/15 bg-white/5" />
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/15 text-gray-300 hover:border-indigo-500/40 hover:bg-white/4 cursor-pointer transition-all text-sm">
                <ImagePlus className="w-4 h-4 text-indigo-400" />
                Upload / Ganti Foto
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="SEO" description="Judul tab browser dan deskripsi Google">
          <div className="grid grid-cols-1 gap-4">
            <InputField label="Meta Title" value={home.metaTitle} onChange={(v) => setHome("metaTitle", v)} />
            <TextAreaField label="Meta Description" value={home.metaDescription} onChange={(v) => setHome("metaDescription", v)} rows={3} />
            <InputField label="Canonical URL" value={home.canonicalUrl} onChange={(v) => setHome("canonicalUrl", v)} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
