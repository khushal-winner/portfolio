import { Mail, MapPin, Linkedin, Github } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="bg-bg-secondary rounded-card p-6 shadow-card border border-border-default/30 h-full  flex flex-col">
      {/* Profile Photo */}
      <div className="flex justify-center mb-4">
        <div className="w-[140px] h-[140px] rounded-profile overflow-hidden border-2 border-border-default/50 shadow-lg">
          <img
            src="me.jpg"
            alt="Khushal Malhotra - Software Engineer"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 30%" }}
            loading="eager"
          />
        </div>
      </div>

      {/* Name */}
      <h1 className="font-script italic text-[22px] text-text-primary text-center mb-3">
        Khushal Malhotra
      </h1>

      {/* Role Badge */}
      <div className="flex justify-center mb-5">
        <span className="px-4 py-1.5 text-[11px] uppercase tracking-wider text-text-secondary border border-border-default rounded-pill font-medium">
          Software Developer
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-border-default my-5" />

      {/* Contact Info */}
      <div className="space-y-4 mb-5 flex-grow">
        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-btn bg-bg-elevated flex items-center justify-center flex-shrink-0">
            <Mail size={16} className="text-accent-primary" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium block">
              EMAIL
            </span>
            <a
              href="mailto:khushalmalhotra775@gmail.com"
              className="text-[13px] text-text-primary hover:text-accent-primary transition-colors duration-200 break-all"
            >
              khushalmalhotra775@gmail.com
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-btn bg-bg-elevated flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-accent-primary" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-medium block">
              LOCATION
            </span>
            <span className="text-[13px] text-text-primary">Delhi, IN</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border-default my-5" />

      {/* Social Links */}
      <div className="flex justify-center gap-3">
        {[
          {
            icon: Linkedin,
            href: "https://www.linkedin.com/in/khushal-malhotra-643232207/",
            label: "LinkedIn",
          },
          {
            icon: XIcon,
            href: "https://x.com/wonitkhushal",
            label: "X (Twitter)",
          },
          {
            icon: Github,
            href: "https://github.com/khushal-winner",
            label: "GitHub",
          },
        ].map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="w-8 h-8 rounded-btn bg-bg-elevated flex items-center justify-center 
                       text-text-secondary hover:text-accent-primary hover:bg-bg-elevated/80 
                       transition-all duration-150"
          >
            <social.icon size={15} />
          </a>
        ))}
      </div>
    </div>
  );
}

// Custom X (Twitter) icon
function XIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
