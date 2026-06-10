import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabase";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import Certificate from "../components/Certificate";
import AOS from "aos";
import "aos/dist/aos.css";
import { Award, Boxes, Code, Images } from "lucide-react";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => ({
  id: `full-width-tab-${index}`,
  "aria-controls": `full-width-tabpanel-${index}`,
});

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button onClick={onClick} className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm">
    {isShowingMore ? "See Less" : "See More"}
  </button>
);

const EmptyState = ({ text }) => (
  <div className="w-full py-16 text-center rounded-2xl border border-white/10 bg-white/5">
    <p className="text-slate-400 text-sm">{text}</p>
  </div>
);

const GalleryCard = ({ item }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      {!loaded && <div className="w-full aspect-square bg-white/5 animate-pulse" />}
      <img
        src={item.Img}
        alt={item.Title || "My Gallery"}
        onLoad={() => setLoaded(true)}
        className={`w-full aspect-square object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? "block" : "hidden"}`}
      />
      {loaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-white text-sm font-medium line-clamp-2">{item.Title || "My Gallery"}</p>
        </div>
      )}
    </div>
  );
};

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({ once: false, mirror: true });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [projectsResponse, certificatesResponse, galleryResponse] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: false }),
        supabase.from("certificates").select("*").order("id", { ascending: false }),
        supabase.from("gallery").select("*").order("created_at", { ascending: false }),
      ]);

      if (projectsResponse.error) throw projectsResponse.error;
      if (certificatesResponse.error) throw certificatesResponse.error;

      const projectData = projectsResponse.data || [];
      const certificateData = certificatesResponse.data || [];
      const galleryData = galleryResponse.error ? [] : galleryResponse.data || [];

      setProjects(projectData);
      setCertificates(certificateData);
      setGallery(galleryData);

      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
      localStorage.setItem("gallery", JSON.stringify(galleryData));
      window.dispatchEvent(new Event("portfolioDataUpdated"));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);

  useEffect(() => {
    const cachedProjects = localStorage.getItem("projects");
    const cachedCertificates = localStorage.getItem("certificates");
    const cachedGallery = localStorage.getItem("gallery");

    if (cachedProjects) setProjects(JSON.parse(cachedProjects));
    if (cachedCertificates) setCertificates(JSON.parse(cachedCertificates));
    if (cachedGallery) setGallery(JSON.parse(cachedGallery));

    fetchData();
  }, [fetchData]);

  const toggleShowMore = useCallback((type) => {
    if (type === "projects") setShowAllProjects((prev) => !prev);
    if (type === "certificates") setShowAllCertificates((prev) => !prev);
    if (type === "gallery") setShowAllGallery((prev) => !prev);
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);
  const displayedGallery = showAllGallery ? gallery : gallery.slice(0, initialItems);

  const tabSx = {
    minHeight: "70px",
    "& .MuiTab-root": {
      fontSize: { xs: "0.72rem", sm: "0.9rem", md: "1rem" },
      fontWeight: "600",
      color: "#94a3b8",
      textTransform: "none",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      padding: { xs: "14px 0", sm: "20px 0" },
      zIndex: 1,
      margin: { xs: "4px", sm: "8px" },
      borderRadius: "12px",
      minWidth: 0,
      "&:hover": { color: "#ffffff", backgroundColor: "rgba(139, 92, 246, 0.1)", transform: "translateY(-2px)" },
      "&.Mui-selected": { color: "#fff", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))", boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)" },
    },
    "& .MuiTabs-indicator": { height: 0 },
    "& .MuiTabs-flexContainer": { gap: { xs: "2px", sm: "8px" } },
  };

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          Portfolio Showcase
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, gallery, and technical expertise.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: "transparent", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", position: "relative", overflow: "hidden" }} className="md:px-4">
          <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} textColor="secondary" indicatorColor="secondary" variant="fullWidth" sx={tabSx}>
            <Tab icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />} label="Projects" {...a11yProps(0)} />
            <Tab icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />} label="Certificates" {...a11yProps(1)} />
            <Tab icon={<Images className="mb-2 w-5 h-5 transition-all duration-300" />} label="My Gallery" {...a11yProps(2)} />
            <Tab icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />} label="Tech Stack" {...a11yProps(3)} />
          </Tabs>
        </AppBar>

        <SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={value} onChangeIndex={setValue}>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div key={project.id || index} data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"} data-aos-duration="1000">
                    <CardProject Img={project.Img} Title={project.Title} Description={project.Description} Link={project.Link} id={project.id} />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && <div className="mt-6 w-full flex justify-start"><ToggleButton onClick={() => toggleShowMore("projects")} isShowingMore={showAllProjects} /></div>}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div key={certificate.id || index} data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"} data-aos-duration="1000">
                    <Certificate ImgSertif={certificate.Img} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && <div className="mt-6 w-full flex justify-start"><ToggleButton onClick={() => toggleShowMore("certificates")} isShowingMore={showAllCertificates} /></div>}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              {displayedGallery.length === 0 ? (
                <EmptyState text="Belum ada foto di My Gallery." />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 w-full">
                  {displayedGallery.map((item, index) => (
                    <div key={item.id || index} data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"} data-aos-duration="1000">
                      <GalleryCard item={item} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {gallery.length > initialItems && <div className="mt-6 w-full flex justify-start"><ToggleButton onClick={() => toggleShowMore("gallery")} isShowingMore={showAllGallery} /></div>}
          </TabPanel>

          <TabPanel value={value} index={3} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div key={index} data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"} data-aos-duration="1000">
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
