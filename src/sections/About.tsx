import { FolderOpen } from "lucide-react";
import { SectionHeader, useInView } from "../components/Shared";

const featuredProjects = [
  {
    title: "ShinkAI - AI Resume & Interview Coach",
    url: "https://shinkai-khushal.vercel.app/", // Placeholder
    description:
      "Built an AI career assistant using Next.js 15, React 19, and Tailwind CSS. Used Clerk for auth, Google Gemini API for resume, cover letter, and mock interview generation.",
    thumbnail: "/shinkai.png",
  },
  {
    title: "Volty - AI Code Companion",
    url: "https://volty-green.vercel.app", // Placeholder
    description:
      "Built an AI-powered micro SaaS platform using Next.js 15, Convex, Google Auth, and React. Integrated Sandpack for live in-browser code editing and preview.",
    thumbnail: "/volty.png",
  },
];

export default function About() {
  const heroView = useInView();
  const portfolioView = useInView();

  return (
    <section id="about" className="space-y-8" aria-label="Khushal Malhotra">
      {/* Hero Introduction */}
      <div
        ref={heroView.ref}
        className={`transition-all duration-600 ${heroView.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <SectionHeader title="Digital Identity" isH1 icon={null} />

        <div className="space-y-4 bg-bg-secondary p-5 rounded-card border border-border-default/40">
          {/* <p className="text-[14px] sm:text-[15px] text-text-secondary leading-[1.8]">
                        I'm <span className="text-text-primary font-medium">Khushal malhotra</span>, a Software Engineer based in{' '}
                        <span className="text-text-primary">Bangalore, India</span>. Passionate about programming, web development,
                        and building scalable solutions to solve real-world problems.
                    </p>
                    <p className="text-[14px] sm:text-[15px] text-text-secondary leading-[1.8]">
                        I hold a postgraduate degree from the{' '}
                        <span className="text-text-primary">National Institute of Technology, Tiruchirappalli</span>, and have worked at
                        Amazon as a Software Development Engineer (SDE) since 2018. My passion for continuous learning drives me to
                        stay up-to-date with the latest technologies and frameworks in the industry.
                    </p> */}
          <p>
            I'm <span className="font-medium">Khushal Malhotra</span>, I am a
            results-oriented and detail-driven engineer with a strong
            programming background and a passion for ensuring software
            reliability. Currently, I am building web applications using
            Next.js, Typescript, Tailwind CSS, and MongoDB. I am seeking
            opportunities to contribute and enhance my skills and am currently
            learning AI to make my web apps more interesting.
          </p>
        </div>
      </div>

      {/* Featured Portfolios */}
      <div
        ref={portfolioView.ref}
        className={`transition-all duration-600 delay-200 ${portfolioView.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <SectionHeader
          title="Featured Portfolios"
          icon={<FolderOpen size={20} />}
        />
        <p className="text-[14px] text-text-muted -mt-4 mb-6">
          A glimpse into my professional journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {featuredProjects.map((project, i) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-bg-secondary rounded-card border border-border-default/40 overflow-hidden
                         hover:-translate-y-1 hover:shadow-hover hover:border-accent-primary/30
                         transition-all duration-200 cursor-pointer group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={`${project.title} screenshot`}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-[12px] text-text-muted mb-1">
                  {project.url}
                </p>
                <h3 className="text-[16px] sm:text-[18px] font-bold text-text-primary mb-1">
                  {project.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-text-secondary line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
