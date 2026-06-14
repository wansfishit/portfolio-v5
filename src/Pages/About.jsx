import React, { useEffect, useMemo, useState } from "react";
import { Award, Code, FileText, Globe, Sparkles, X } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { fetchSiteContent, readSiteContent, SITE_CONTENT_UPDATED_EVENT } from "../data/siteContent";
import Swal from "sweetalert2";

const StatCard = ({ icon: Icon, value, label, description }) => (
  <div className="relative bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 h-full">
    <div className="flex items-center justify-between mb-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <span className="text-4xl font-bold text-white">{value}</span>
    </div>
    <p className="text-sm uppercase tracking-wider text-gray-300 mb-2">{label}</p>
    <p className="text-xs text-gray-400">{description}</p>
  </div>
);

export default function AboutPage() {
  const [siteContent, setSiteContent] = useState(() => readSiteContent());
  const about = siteContent.about;
  const [stats, setStats] = useState({ totalProjects: 0, totalCertificates: 0, YearExperience: 0 });
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      const data = await fetchSiteContent();
      if (mounted) setSiteContent(data);
    };

    const updateContent = () => setSiteContent(readSiteContent());

    loadContent();
    window.addEventListener("storage", updateContent);
    window.addEventListener(SITE_CONTENT_UPDATED_EVENT, updateContent);

    return () => {
      mounted = false;
      window.removeEventListener("storage", updateContent);
      window.removeEventListener(SITE_CONTENT_UPDATED_EVENT, updateContent);
    };
  }, []);

  useEffect(() => {
    const updateStats = () => {
      const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
      const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
      const startDate = new Date(about.experienceStartDate || "2021-11-06");
      const today = new Date();
      const experience = today.getFullYear() - startDate.getFullYear() -
        (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

      setStats({
        totalProjects: storedProjects.length,
        totalCertificates: storedCertificates.length,
        YearExperience: Number.isFinite(experience) ? Math.max(experience, 0) : 0,
      });
    };

    updateStats();
    window.addEventListener("storage", updateStats);
    window.addEventListener("portfolioDataUpdated", updateStats);

    return () => {
      window.removeEventListener("storage", updateStats);
      window.removeEventListener("portfolioDataUpdated", updateStats);
    };
  }, [about.experienceStartDate]);

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const statsData = useMemo(() => [
    { icon: Code, value: stats.totalProjects, label: "Total Projects", description: "Innovative web solutions crafted" },
    { icon: Award, value: stats.totalCertificates, label: "Certificates", description: "Professional skills validated" },
    { icon: Globe, value: stats.YearExperience, label: "Years of Experience", description: "Continuous learning journey" },
  ], [stats]);

  return (
    <div className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0" id="About" itemScope itemType="https://schema.org/Person">
      <div className="text-center lg:mb-8 mb-2 px-[5%]">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]" data-aos="zoom-in-up">
          {about.heading}
        </h2>
        <p className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2" data-aos="zoom-in-up">
          <Sparkles className="w-5 h-5 text-purple-400" />
          {about.intro}
          <Sparkles className="w-5 h-5 text-purple-400" />
        </p>
      </div>

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" data-aos="fade-right">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">{about.greeting}</span>
              <span className="block mt-2 text-gray-200" itemProp="name">{about.name}</span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0" data-aos="fade-right">
              {about.description}
            </p>

            <div className="relative bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 border border-[#6366f1]/30 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden" data-aos="fade-up">
              <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm relative z-10 pl-6">
                "{about.quote}"
              </blockquote>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:px-0 w-full">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (!about.cvUrl) {
                    Swal.fire({
                      title: "Informasi",
                      text: "CV belum diunggah oleh Admin.",
                      icon: "info",
                      confirmButtonColor: "#6366f1",
                    });
                    return;
                  }
                  setIsCvModalOpen(true);
                }}
                className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 shadow-lg hover:shadow-xl"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> {about.cvButtonLabel}
              </button>
              <a href="#Portofolio" className="w-full lg:w-auto">
                <button className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border border-[#a855f7]/50 text-[#a855f7] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 hover:bg-[#a855f7]/10">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" /> {about.projectButtonLabel}
                </button>
              </a>
            </div>
          </div>

          <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
            <div className="relative group" data-aos="fade-up">
              <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-full blur-2xl animate-spin-slower" />
                <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500 via-rose-500 to-pink-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
              </div>
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)]">
                <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20" />
                <img src={about.photo || "/Photo.jpg"} alt="Profile" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </div>
        </a>
      </div>

      {/* CV PDF Preview Modal */}
      {isCvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsCvModalOpen(false)}>
          <div className="relative w-full max-w-4xl rounded-2xl bg-[#09091e] border border-white/10 p-5 text-white shadow-2xl flex flex-col gap-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                CV / Resume Preview
              </h3>
              <div className="flex gap-2">
                <a href={about.cvUrl} download className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 text-slate-300 hover:text-white" title="Unduh CV">
                  <FileText className="w-5 h-5" />
                  <span className="text-xs hidden sm:inline">Download</span>
                </a>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white" onClick={() => setIsCvModalOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="w-full flex-1 min-h-[60vh] rounded-xl overflow-hidden bg-black/40">
              <iframe src={about.cvUrl} className="w-full h-[60vh] border-0" title="CV / Resume PDF Preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
