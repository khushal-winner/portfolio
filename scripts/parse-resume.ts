import fs from 'fs';
import path from 'path';

interface ResumeData {
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string[];
  }>;
  education: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  skills: Array<{
    category: string;
    items: string;
  }>;
  projects: Array<{
    title: string;
    links: string;
    description: string[];
  }>;
}

function parseLatexResume(texContent: string): ResumeData {
  const data: ResumeData = {
    experience: [],
    education: [],
    skills: [],
    projects: [],
  };

  // Parse Experience section
  const experienceMatch = texContent.match(/\\section\{Experience\}([\s\S]*?)(?=\\section|$)/);
  if (experienceMatch) {
    const experienceContent = experienceMatch[1];
    const subheadings = experienceContent.matchAll(/\\resumeSubheading\{([^}]+)\}\{([^}]+)\}\{([^}]+)\}\{([^}]+)\}([\s\S]*?)\\resumeItemListEnd/g);
    
    for (const match of subheadings) {
      const [, title, period, company, location, descBlock] = match;
      const items = descBlock.match(/\\resumeItem\{([^}]+)\}/g) || [];
      const description = items.map(item => item.replace(/\\resumeItem\{([^}]+)\}/, '$1'));
      
      data.experience.push({
        title,
        company: `${company}${location ? `, ${location}` : ''}`,
        period,
        description,
      });
    }
  }

  // Parse Open Source Contributions section
  const contributionsMatch = texContent.match(/\\section\{Open Source Contributions\}([\s\S]*?)(?=\\section|$)/);
  if (contributionsMatch) {
    const contributionsContent = contributionsMatch[1];
    const subheadings = contributionsContent.matchAll(/\\resumeSubheading\{([^}]+)\}\{([^}]+)\}\{([^}]+)\}\{([^}]*)\}([\s\S]*?)\\resumeItemListEnd/g);
    
    for (const match of subheadings) {
      const [, title, period, company, location, descBlock] = match;
      const items = descBlock.match(/\\resumeItem\{([^}]+)\}/g) || [];
      const description = items.map(item => item.replace(/\\resumeItem\{([^}]+)\}/, '$1'));
      
      data.experience.push({
        title,
        company: company || 'Multiple Projects',
        period,
        description,
      });
    }
  }

  // Parse Education section
  const educationMatch = texContent.match(/\\section\{Education\}([\s\S]*?)(?=\\section|$)/);
  if (educationMatch) {
    const educationContent = educationMatch[1];
    const subheadings = educationContent.matchAll(/\\resumeSubheading\{([^}]+)\}\{([^}]+)\}\{([^}]+)\}\{([^}]+)\}/g);
    
    for (const match of subheadings) {
      const [, title, company, degree, period] = match;
      data.education.push({
        title: degree || title,
        company: company,
        period,
        description: '',
      });
    }
  }

  // Parse Skills section
  const skillsMatch = texContent.match(/\\section\{Technical Skills\}([\s\S]*?)(?=\\section|$)/);
  if (skillsMatch) {
    const skillsContent = skillsMatch[1];
    const skillItems = skillsContent.matchAll(/\\textbf\{([^}]+)\}\{:([^}]+)\}/g);
    
    for (const match of skillItems) {
      const [, category, items] = match;
      data.skills.push({
        category,
        items: items.trim(),
      });
    }
  }

  // Parse Projects section
  const projectsMatch = texContent.match(/\\section\{Projects\}([\s\S]*?)(?=\\section|$)/);
  if (projectsMatch) {
    const projectsContent = projectsMatch[1];
    const projectHeadings = projectsContent.matchAll(/\\resumeProjectHeading([\s\S]*?)\\resumeItemListEnd/g);
    
    for (const match of projectHeadings) {
      const projectBlock = match[0];
      const titleMatch = projectBlock.match(/\\textbf\{([^}]+)\}/);
      const linksMatch = projectBlock.match(/\\href\{[^}]+\}\{[^}]+\}/g);
      
      if (titleMatch) {
        const title = titleMatch[1];
        const links = linksMatch ? linksMatch.join(' ') : '';
        const items = projectBlock.match(/\\resumeItem\{([^}]+)\}/g) || [];
        const description = items.map(item => item.replace(/\\resumeItem\{([^}]+)\}/, '$1'));
        
        data.projects.push({
          title,
          links,
          description,
        });
      }
    }
  }

  return data;
}

// Main execution
const texFilePath = path.join(process.cwd(), 'resume.tex');
const outputPath = path.join(process.cwd(), 'src', 'data', 'resume-data.json');

try {
  const texContent = fs.readFileSync(texFilePath, 'utf-8');
  const resumeData = parseLatexResume(texContent);
  
  // Ensure the data directory exists
  const dataDir = path.dirname(outputPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(resumeData, null, 2));
  console.log('Resume data successfully parsed and saved to', outputPath);
} catch (error) {
  console.error('Error parsing resume:', error);
  process.exit(1);
}
