import { GraduationCap, Code, Briefcase } from "lucide-react";
import { SectionHeader, useInView } from "../components/Shared";

interface TimelineEntry {
  title: string;
  company: string;
  period: string;
  description: string | string[];
}

const experience: TimelineEntry[] = [
  {
    title: "Intern",
    company: "Company Name",
    period: "Oct 2025 — Dec 2025",
    description: [
      "Developed and implemented responsive web applications using modern frontend frameworks",
      "Collaborated with cross-functional teams to design and optimize user interfaces",
      "Contributed to code reviews and implemented best practices for maintainable code",
      "Assisted in troubleshooting and debugging applications to improve performance",
    ],
  },
];

const education: TimelineEntry[] = [
  {
    title: "Bachelor in Electronics",
    company: "Netaji Subhash University of Technology",
    period: "Aug 2024 — May 2028",
    description: "Main campus, Dwarka.",
  },
  {
    title: "JEE Mains Qualified",
    company: "National Testing Agency",
    period: "April 2024",
    description: "Secured 98.6 percentile.",
  },
];

const skills = [
  { category: "Languages", items: "JavaScript, TypeScript, C++, HTML, CSS" },
  {
    category: "Frameworks",
    items: "React.js, Node.js, Express.js, Socket.io, Next.js, Zustand",
  },
  {
    category: "Design & UI",
    items: "Tailwind CSS, DaisyUI, Chakra UI, Shadcn UI, Framer-motion",
  },
  {
    category: "Database & ORM",
    items: "MongoDB, Neon (PostgreSQL), Redis, Mongoose, Prisma",
  },
  { category: "Tools", items: "Git, Clerk, JWT, Stripe, Convex, Webhooks" },
];

function TimelineItem({
  entry,
  index,
}: {
  entry: TimelineEntry;
  index: number;
}) {
  const itemView = useInView(0.15);

  return (
    <div
      ref={itemView.ref}
      className={`relative pl-8 pb-8 last:pb-0 transition-all duration-500 ${
        itemView.isInView
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-6"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-[10px] h-[10px] rounded-full bg-accent-primary shadow-[0_0_8px_rgba(0,188,212,0.4)]" />
      {/* Timeline connector line */}
      <div className="absolute left-[4px] top-4 bottom-0 w-[2px] bg-border-default last:hidden" />

      <h3 className="text-[15px] font-bold text-text-primary">{entry.title}</h3>
      <p className="text-[14px] text-text-secondary mt-0.5">{entry.company}</p>
      <p className="text-[13px] text-accent-primary font-medium mt-1.5 mb-2">
        {entry.period}
      </p>

      {Array.isArray(entry.description) ? (
        <div className="space-y-1.5">
          {entry.description.map((item, i) => (
            <p
              key={i}
              className="text-[14px] text-text-secondary leading-[1.7]"
            >
              ➤ {item}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-[14px] text-text-secondary leading-[1.7]">
          {entry.description}
        </p>
      )}
    </div>
  );
}

export default function Resume() {
  return (
    <section
      id="resume"
      className="space-y-10"
      aria-label="Resume and career snapshot"
    >
      <SectionHeader title="Resume" isH1 icon={null} />

      {/* Experience */}
      <div>
        <SectionHeader title="Experience" icon={<Briefcase size={20} />} />
        <div className="mt-4">
          {experience.map((entry, i) => (
            <TimelineItem key={entry.title} entry={entry} index={i} />
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <SectionHeader title="Education" icon={<GraduationCap size={20} />} />
        <div className="mt-4">
          {education.map((entry, i) => (
            <TimelineItem key={entry.title} entry={entry} index={i} />
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div>
        <SectionHeader title="Technical Skills" icon={<Code size={20} />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {skills.map((skill) => (
            <div
              key={skill.category}
              className="bg-bg-secondary p-4 rounded-card border border-border-default/40 hover:border-accent-primary/30 transition-colors"
            >
              <h4 className="text-[14px] font-bold text-text-primary mb-2">
                {skill.category}
              </h4>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                {skill.items}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
