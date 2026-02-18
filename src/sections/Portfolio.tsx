import { SectionHeader, useInView } from "../components/Shared";

const projects = [
  {
    title: "ShinkAI - AI Resume & Interview Coach",
    url: "https://shinkai-khushal.vercel.app/",
    description:
      "Built an AI career assistant using Next.js 15, React 19, and Tailwind CSS. Used Clerk for auth, Google Gemini API for resume, cover letter, and mock interview generation.",
    thumbnail: "/shinkai.png",
  },
  {
    title: "Volty - AI Code Companion",
    url: "https://volty-green.vercel.app",
    description:
      "Built an AI-powered micro SaaS platform using Next.js 15, Convex, Google Auth, and React. Integrated Sandpack for live in-browser code editing and preview.",
    thumbnail: "/volty.png",
  },
  {
    title: "Chaty-Chat App",
    url: "https://chatu-chat-app-1.onrender.com/login",
    description:
      "Developed a full-stack chat web application using MongoDB, Express.js, React.js, Node.js (MERN stack). Implemented authentication and authorization with JWT.",
    thumbnail: "chatu.png",
  },
  {
    title: "EzexEcom-App",
    url: "https://ecommerce-app-ezex.onrender.com/",
    description:
      "Built a full-featured e-commerce app with product listings, cart, and checkout using the MERN stack. Integrated MongoDB for data storage and Redis for caching.",
    thumbnail:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=375&fit=crop",
  },
];

export default function Portfolio() {
  const sectionView = useInView();

  return (
    <section id="projects" aria-label="Portfolio projects">
      <SectionHeader title="Selected Projects" isH1 icon={null} />

      <div
        ref={sectionView.ref}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2"
      >
        {projects.map((project, i) => (
          <a
            key={project.title}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block bg-bg-secondary rounded-card border border-border-default/40 overflow-hidden
                       hover:-translate-y-1 hover:shadow-hover hover:border-accent-primary/30
                       transition-all duration-200 cursor-pointer group
                       ${sectionView.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            style={{
              transitionDelay: `${i * 100}ms`,
              transitionDuration: "500ms",
            }}
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
              <p className="text-[12px] text-text-muted mb-1">{project.url}</p>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-text-primary mb-1">
                {project.title}
              </h3>
              <p className="text-[13px] sm:text-[14px] text-text-secondary line-clamp-3 leading-relaxed">
                {project.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
