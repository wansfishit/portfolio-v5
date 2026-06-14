import { useEffect, useState } from "react";
import { fetchSiteContent, readSiteContent, SITE_CONTENT_UPDATED_EVENT } from "../data/siteContent";
import {
  Linkedin,
  Github,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const TikTokIcon = ({ className, ...props }) => (
  <svg
    className={className}
    viewBox="0 0 45 45"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M29.52 9.45c-1.44-.4-2.76-1.15-3.84-2.19-.17-.16-.33-.33-.49-.5-1.29-1.48-1.98-3.37-1.96-5.33h-5.88v22.29c0 4.08-2.2 6.24-4.94 6.24-.72.01-1.44-.14-2.1-.44-.66-.3-1.24-.74-1.71-1.29-.47-.55-.81-1.19-1.01-1.89-.19-.7-.23-1.43-.11-2.14.12-.71.39-1.39.8-1.99.41-.6.94-1.09 1.56-1.46.62-.37 1.32-.59 2.04-.66.72-.07 1.44.02 2.13.26v-5.99c-.53-.12-1.06-.17-1.6-.17h-.02c-2.14 0-4.23.64-6 1.83-1.78 1.19-3.16 2.88-3.97 4.86-.82 1.98-1.03 4.15-.61 6.25.42 2.1 1.45 4.02 2.97 5.53 1.51 1.51 3.44 2.54 5.54 2.95 2.1.41 4.27.2 6.24-.62 1.97-.82 3.66-2.2 4.85-3.98 1.19-1.78 1.82-3.87 1.82-6.01V12.82c2.28 1.57 5 2.31 7.9 2.37V9.69c-.54-.02-1.08-.1-1.6-.24Z"
      fill="#FE2C55"
    />
    <path
      d="M25.2 6.75c-.4-.28-.78-.59-1.14-.92-1.24-1.17-2.05-2.72-2.32-4.41C21.66.95 21.62.48 21.62 0h-5.88v22.64c0 4.87-2.2 5.88-4.94 5.88-.72.01-1.44-.14-2.1-.44-.66-.3-1.24-.74-1.71-1.29-.47-.55-.81-1.19-1-1.89-.2-.7-.24-1.43-.12-2.14.12-.71.39-1.39.8-1.99.41-.6.94-1.09 1.56-1.46.62-.37 1.32-.59 2.04-.66.72-.07 1.44.02 2.12.26v-5.99C5.4 11.82 0 17.48 0 23.58c0 2.87 1.15 5.61 3.17 7.64 2.03 2.02 4.78 3.16 7.64 3.17 5.96 0 10.81-3.64 10.81-10.81V11.39c2.28 1.59 5 2.32 7.9 2.37V8.26c-1.56-.07-3.06-.59-4.32-1.51Z"
      fill="#25F4EE"
    />
    <path
      d="M21.62 23.58V11.39c2.28 1.59 5 2.32 7.9 2.37V9.45c-1.44-.4-2.76-1.15-3.84-2.19-.17-.16-.33-.33-.49-.5-.4-.28-.78-.59-1.14-.92-1.24-1.17-2.05-2.72-2.32-4.41h-4.37v22.29c0 4.08-2.2 6.24-4.94 6.24-.78 0-1.54-.19-2.23-.54-.69-.35-1.29-.87-1.74-1.5-.97-.52-1.73-1.35-2.17-2.36-.44-1.01-.53-2.13-.26-3.2.27-1.06.89-2.01 1.76-2.68.87-.67 1.94-1.04 3.03-1.04.54 0 1.08.1 1.6.28v-4.73c-2.1 0-4.16.62-5.92 1.78-1.76 1.16-3.14 2.8-3.98 4.73-.84 1.93-1.09 4.06-.73 6.14.36 2.07 1.32 3.99 2.75 5.53 1.83 1.31 4.03 2.02 6.28 2.02 5.96 0 10.81-3.64 10.81-10.81Z"
      fill="#000000"
    />
  </svg>
);

const socialLinks = [
  {
    name: "LinkedIn",
    displayName: "Let's Connect",
    subText: "Coming soon",
    icon: Linkedin,
    url: "#",
    color: "#0A66C2",
    gradient: "from-[#0A66C2] to-[#0077B5]",
    isPrimary: true,
    disabled: true,
  },
  {
    name: "Instagram",
    displayName: "Instagram",
    subText: "@r1stno",
    icon: Instagram,
    url: "https://www.instagram.com/r1stno?igsh=c2t0NmlpMjNodTQ%3D&utm_source=qr",
    color: "#E4405F",
    gradient: "from-[#833AB4] via-[#E4405F] to-[#FCAF45]",
  },
  {
    name: "YouTube",
    displayName: "Youtube",
    subText: "Coming soon",
    icon: Youtube,
    url: "#",
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#CC0000]",
    disabled: true,
  },
  {
    name: "GitHub",
    displayName: "Github",
    subText: "@wansfishit",
    icon: Github,
    url: "https://github.com/wansfishit",
    color: "#ffffff",
    gradient: "from-[#333] to-[#24292e]",
  },
  {
    name: "TikTok",
    displayName: "Tiktok",
    subText: "@muttpcrku",
    icon: TikTokIcon,
    url: "https://www.tiktok.com/@muttpcrku?_r=1&_t=ZS-978V90eaW5w",
    color: "black",
    gradient: "from-[#000000] via-[#25F4EE] to-[#FE2C55]",
  },
];

const SocialCard = ({ link, delay = 100, primary = false }) => {
  const Icon = link.icon;

  const handleClick = (event) => {
    if (link.disabled) {
      event.preventDefault();
    }
  };

  return (
    <a
      href={link.url}
      target={link.disabled ? undefined : "_blank"}
      rel={link.disabled ? undefined : "noopener noreferrer"}
      aria-disabled={link.disabled ? "true" : undefined}
      onClick={handleClick}
      className={`group relative flex items-center ${
        primary ? "justify-between p-4 rounded-lg" : "gap-3 p-4 rounded-xl"
      } bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 ${
        link.disabled ? "cursor-default" : ""
      }`}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r ${link.gradient}`}
      />

      <div className={`relative flex items-center ${primary ? "gap-4" : "gap-3"}`}>
        <div className="relative flex items-center justify-center">
          <div
            className={`absolute inset-0 opacity-20 ${primary ? "rounded-md" : "rounded-lg"} transition-all duration-500 group-hover:scale-110 group-hover:opacity-30`}
            style={{ backgroundColor: link.color }}
          />
          <div className={`relative ${primary ? "p-2 rounded-md" : "p-2 rounded-lg"}`}>
            <Icon
              className={`${primary ? "w-6 h-6" : "w-5 h-5"} transition-all duration-500 group-hover:scale-105`}
              style={{ color: link.color }}
            />
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <span
            className={`${
              primary
                ? "text-lg font-bold pt-[0.2rem] tracking-tight leading-none"
                : "text-sm font-bold"
            } text-gray-200 group-hover:text-white transition-colors duration-300`}
          >
            {link.displayName}
          </span>
          <span
            className={`${
              primary ? "text-sm" : "text-xs truncate"
            } text-gray-400 group-hover:text-gray-300 transition-colors duration-300`}
          >
            {link.subText}
          </span>
        </div>
      </div>

      {!link.disabled && (
        <ExternalLink
          className={`${
            primary ? "relative w-5 h-5 -translate-x-1" : "w-4 h-4 ml-auto -translate-x-2"
          } text-gray-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0`}
        />
      )}

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    </a>
  );
};

const SocialLinks = () => {
  const [siteContent, setSiteContent] = useState(() => readSiteContent());
  const home = siteContent.home;

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
    AOS.init({
      offset: 10,
    });
  }, []);

  const dynamicLinks = socialLinks.map((link) => {
    if (link.name === "LinkedIn") {
      const url = home.linkedinUrl || "";
      const hasUrl = url && url !== "#" && url !== "";
      return {
        ...link,
        url: hasUrl ? url : "#",
        disabled: !hasUrl,
        subText: hasUrl ? (url.includes("linkedin.com/in/") ? "@" + url.split("linkedin.com/in/")[1].split("/")[0] : "LinkedIn Profile") : "Coming soon",
      };
    }
    if (link.name === "Instagram") {
      const url = home.instagramUrl || "https://www.instagram.com/r1stno?igsh=c2t0NmlpMjNodTQ%3D&utm_source=qr";
      let username = "@r1stno";
      try {
        if (url.includes("instagram.com/")) {
          const parts = url.split("instagram.com/")[1].split("?")[0].split("/");
          username = "@" + parts[0];
        }
      } catch (e) {}
      return {
        ...link,
        url: url,
        subText: username,
      };
    }
    if (link.name === "GitHub") {
      const url = home.githubUrl || "https://github.com/wansfishit";
      let username = "@wansfishit";
      try {
        if (url.includes("github.com/")) {
          const parts = url.split("github.com/")[1].split("?")[0].split("/");
          username = "@" + parts[0];
        }
      } catch (e) {}
      return {
        ...link,
        url: url,
        subText: username,
      };
    }
    return link;
  });

  const linkedIn = dynamicLinks.find((link) => link.isPrimary);
  const otherLinks = dynamicLinks.filter((link) => !link.isPrimary);
  const [instagram, youtube, github, tiktok] = otherLinks;

  return (
    <div className="w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 py-8 backdrop-blur-xl">
      <h3
        className="text-xl font-semibold text-white mb-6 flex items-center gap-2"
        data-aos="fade-down"
      >
        <span className="inline-block w-8 h-1 bg-indigo-500 rounded-full"></span>
        Connect With Me
      </h3>

      <div className="flex flex-col gap-4">
        <SocialCard link={linkedIn} primary delay={100} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[instagram, youtube].map((link, index) => (
            <SocialCard key={link.name} link={link} delay={200 + index * 100} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[github, tiktok].map((link, index) => (
            <SocialCard key={link.name} link={link} delay={400 + index * 100} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
