import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Navigation from "./components/Navigation";
import About from "./sections/About";
import Resume from "./sections/Resume";
import Portfolio from "./sections/Portfolio";
import Contact from "./sections/Contact";
// import Gallery from './sections/Gallery';

const sections = ["about", "resume", "projects", "contact"] as const;
type Section = (typeof sections)[number];

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("about");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleNavClick = useCallback(
    (section: Section) => {
      if (section === activeSection) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveSection(section);
        setIsTransitioning(false);
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }, 200);
      window.location.hash = section;
    },
    [activeSection],
  );

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as Section;
      if (sections.includes(hash) && hash !== activeSection) {
        setActiveSection(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case "about":
        return <About />;
      case "resume":
        return <Resume />;
      case "projects":
        return <Portfolio />;
      case "contact":
        return <Contact />;
      // case 'gallery': return <Gallery />;
      default:
        return <About />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex justify-center">
      <div className="flex w-full max-w-[1200px] gap-6 p-6 lg:p-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-[320px] flex-shrink-0 sticky top-6 left-6 h-[calc(100vh-3rem)]">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Mobile Sidebar */}
          <div className="lg:hidden mb-6">
            <Sidebar />
          </div>

          {/* Navigation */}
          <Navigation active={activeSection} onNavigate={handleNavClick} />

          {/* Content Area */}
          <div
            ref={contentRef}
            className={`flex-1 mt-4 transition-all duration-200 ${
              isTransitioning
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
