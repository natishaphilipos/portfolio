import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Download, 
  ChevronDown,
  Shield,
  Cloud,
  Code,
  Award,
  FileText,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react'

const portfolioData = {
  name: "Nathanim Philipos",
  title: "GRC Professional",
  location: "St. Louis, MO",
  email: "nathan.philipos12@gmail.com",
  linkedin: "https://www.linkedin.com/in/nathanim-philipos-9688a2274/",
  github: "https://github.com/nathanimphilipos",
  website: "https://tenagrc.com",
  summary: [
    "I am an MBA Candidate at Missouri State University and a GRC Professional at SaltyCloud, working at the intersection of security, technology, and communication. I specialize in translating complex security and compliance requirements into clear, actionable guidance that engineering teams, leadership, and non-technical stakeholders can actually use. My work spans SOC 2 operations, FedRAMP Moderate alignment, vendor risk management, and AWS-native control implementation.",
    "My approach to GRC is both technical and human-centered. I focus on designing compliance programs that reflect how systems truly operate — not how frameworks are written on paper. By combining cloud context, automation, and structured workflows, I aim to make risk visible without adding unnecessary friction. I believe strong governance enables velocity when it is embedded into engineering processes rather than imposed as an external checkpoint.",
    "Outside of my day-to-day role, I build tools and content that push modern GRC forward. I created TenaGRC, a lightweight risk analysis platform designed to give startups rapid insight into their security posture without the overhead of traditional GRC tooling. At heart, I am relationship-first: the best security outcomes come from empathy, clarity, and collaboration. Originally from Addis Ababa, Ethiopia, I thrive in fast-changing, diverse environments and remain committed to continuous learning, technical growth, and advancing a GRC community that is modern, practical, and people-focused."
  ],
  professionalSkills: [
    { name: "Program Ownership & Accountability", desc: "Lead GovRAMP Moderate and SOC 2 initiatives end-to-end" },
    { name: "Autonomous & Self-Directed", desc: "Thrive in fast-moving startup environments" },
    { name: "Cross-Functional Communicator", desc: "Bridge technical and executive audiences" },
    { name: "Relationship-First Security", desc: "Collaborative approach over gatekeeping" },
    { name: "Risk-Based Decision Making", desc: "Prioritize by impact, likelihood, and context" },
    { name: "Execution-Oriented", desc: "Practical outcomes over checkbox compliance" }
  ],
  technicalSkills: {
    "Cloud Platforms": ["AWS (IAM, Lambda, CloudTrail, Config, Inspector, GuardDuty, Audit Manager)"],
    "Security & Compliance": ["SOC 2 Type II", "FedRAMP Moderate", "NIST CSF", "Vendor Risk Management", "Internal Audit"],
    "Tools & Technologies": ["IsoraGRC", "Drata", "Ascend", "AWS Audit Manager", "OpenAI API", "Flask", "Git"],
    "Programming": ["Python", "Bash", "JavaScript", "HTML/CSS"],
    "GRC Frameworks": ["NIST 800-53 Rev. 5", "NIST RMF", "ISO 27001", "ISO 27005", "ISO 42001", "CIS Controls v8"],
    "Other Skills": ["Risk Assessment", "Control Mapping", "Policy Development", "Compliance Automation", "Executive Reporting"]
  },
  certifications: [
    { name: "ISO 42001 Lead Auditor", icon: Award }
  ],
  projects: [
    {
      name: "TenaGRC – GRC Automation Platform",
      description: "Founder-built GRC automation platform designed to generate real-time risk dashboards, narratives, and compliance insights from structured survey inputs.",
      technologies: ["Python", "Flask", "OpenAI API", "AWS", "HTML/CSS", "JavaScript"],
      github: "https://github.com/nathanimphilipos",
      live: "https://tenagrc.com",
      achievements: [
        "Built an end-to-end risk scoring and dashboard engine producing results in under 15 seconds",
        "Integrated NIST 800-53, ISO 27005, and CIS v8 into automated scoring logic",
        "Converted qualitative survey responses into structured, auditor-ready narratives"
      ]
    },
    {
      name: "Automated Risk Visualization Tool",
      description: "Internal audit tool developed to automate audit scoping, risk tiering, and heatmap generation from qualitative inputs.",
      technologies: ["Python", "Data Visualization Libraries"],
      achievements: [
        "Reduced audit planning time by ~80 hours",
        "Standardized risk scoring for internal audit teams",
        "Improved consistency in risk communication to stakeholders"
      ]
    },
    {
      name: "Web Security Scanner (CLI)",
      description: "Command-line security tool to identify common web vulnerabilities such as XSS and SQL injection in static web content.",
      technologies: ["Python", "CLI Tooling"],
      achievements: [
        "Implemented repeatable vulnerability detection aligned with OWASP Top 10",
        "Automated logging for secure review and remediation tracking"
      ]
    }
  ],
  articles: [
    { title: "Collaborating with Engineering (...Without Being That Person)", platform: "LinkedIn" },
    { title: "Why Communication is becoming the most important skill in GRC", platform: "LinkedIn" }
  ]
}

function AnimatedSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ]
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tight">NP</a>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a 
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors link-underline"
            >
              {item.name}
            </a>
          ))}
          <a 
            href="/resume.pdf" 
            download
            className="btn-primary text-sm"
          >
            <Download size={16} />
            Resume
          </a>
        </div>
        
        <button 
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                className="text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a 
              href="/resume.pdf" 
              download
              className="btn-primary text-sm justify-center"
            >
              <Download size={16} />
              Resume
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div style={{ y, opacity }} className="section-container text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base font-mono text-gray-500 mb-4 tracking-wider"
          >
            GRC PROFESSIONAL
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            {portfolioData.name}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Designing automated, relationship-centered GRC programs that integrate 
            into real workflows and enable teams to move forward with confidence.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" 
               className="p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300">
              <Linkedin size={20} />
            </a>
            <a href={portfolioData.github} target="_blank" rel="noopener noreferrer"
               className="p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300">
              <Github size={20} />
            </a>
            <a href={`mailto:${portfolioData.email}`}
               className="p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300">
              <Mail size={20} />
            </a>
            <a href={portfolioData.website} target="_blank" rel="noopener noreferrer"
               className="p-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300">
              <ExternalLink size={20} />
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-4"
          >
            <a href="#projects" className="btn-primary">
              View Projects
              <ArrowUpRight size={18} />
            </a>
            <a href="/resume.pdf" download className="btn-secondary">
              <Download size={18} />
              Download Resume
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={32} className="text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="bg-gray-50">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">About Me</h2>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {portfolioData.summary.map((paragraph, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {paragraph}
                </p>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection delay={0.3}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={18} />
                  <span className="text-sm">{portfolioData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield size={18} />
                  <span className="text-sm">{portfolioData.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Award size={18} />
                  <span className="text-sm">ISO 42001 Lead Auditor</span>
                </div>
              </div>
              
              <hr className="my-6" />
              
              <h3 className="font-semibold text-lg mb-4">Featured Articles</h3>
              <div className="space-y-3">
                {portfolioData.articles.map((article, index) => (
                  <a 
                    key={index}
                    href={portfolioData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-gray-600 hover:text-black transition-colors group"
                  >
                    <span className="flex items-start gap-2">
                      <FileText size={16} className="mt-0.5 shrink-0" />
                      <span className="group-hover:underline">{article.title}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="bg-white">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">Skills & Expertise</h2>
        </AnimatedSection>
        
        <div className="mb-16">
          <AnimatedSection delay={0.1}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Shield size={24} />
              Professional Competencies
            </h3>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioData.professionalSkills.map((skill, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-black transition-colors duration-300">
                  <h4 className="font-semibold mb-1">{skill.name}</h4>
                  <p className="text-sm text-gray-600">{skill.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        
        <div>
          <AnimatedSection delay={0.2}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Code size={24} />
              Technical Skills
            </h3>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(portfolioData.technicalSkills).map(([category, skills], index) => (
              <AnimatedSection key={category} delay={0.3 + index * 0.05}>
                <div className="p-5 bg-black text-white rounded-xl">
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="bg-gray-50">
      <div className="section-container">
        <AnimatedSection>
          <h2 className="section-title">Featured Projects</h2>
        </AnimatedSection>
        
        <div className="space-y-8">
          {portfolioData.projects.map((project, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold">{project.name}</h3>
                      {project.live && (
                        <a 
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-black text-white hover:scale-110 transition-transform"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-lg">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-500">Key Achievements</h4>
                      <ul className="space-y-2">
                        {project.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700">
                            <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 shrink-0"></span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 lg:flex-col">
                    {project.github && (
                      <a 
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm"
                      >
                        <Github size={18} />
                        GitHub
                      </a>
                    )}
                    {project.live && (
                      <a 
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm"
                      >
                        <ExternalLink size={18} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="bg-black text-white">
      <div className="section-container text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Let's Connect</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            I'm always interested in discussing GRC, security, compliance automation, 
            or new opportunities. Feel free to reach out!
          </p>
        </AnimatedSection>
        
        <AnimatedSection delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a 
              href={`mailto:${portfolioData.email}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              <Mail size={20} />
              Send Email
            </a>
            <a 
              href={portfolioData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all"
            >
              <Linkedin size={20} />
              Connect on LinkedIn
            </a>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <div className="flex items-center justify-center gap-6">
            <a href={portfolioData.github} target="_blank" rel="noopener noreferrer"
               className="p-3 border border-gray-700 rounded-full hover:border-white transition-colors">
              <Github size={20} />
            </a>
            <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer"
               className="p-3 border border-gray-700 rounded-full hover:border-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href={portfolioData.website} target="_blank" rel="noopener noreferrer"
               className="p-3 border border-gray-700 rounded-full hover:border-white transition-colors">
              <ExternalLink size={20} />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm flex items-center gap-2">
          <Cloud size={16} />
          Built with React • Deployed on AWS
        </p>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
