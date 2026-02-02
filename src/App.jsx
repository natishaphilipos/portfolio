import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import confetti from 'canvas-confetti'
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
    "I'm Nathanim Philipos, a believer in Christ, an MBA candidate at Missouri State University, and a GRC professional at SaltyCloud, working at the intersection of cybersecurity, cloud technology, and communication. I focus on making GRC clear and practical by removing jargon and translating security requirements into guidance teams can actually use.",
    "At SaltyCloud, I lead SOC 2 operations and GovRAMP Moderate efforts for the IsoraGRC platform, working closely with engineering, development, and executive leadership as a subject-matter expert. I enjoy automation, AWS-native security, and team-based problem solving, and as someone originally from Addis Ababa, Ethiopia, I thrive in fast-changing environments. Feel free to keep scrolling to learn more about me."
  ],
  isoraDescription: "IsoraGRC is redefining how organizations approach information security and risk management. Built for modern teams, the platform streamlines risk assessments, simplifies compliance operations, and provides clear visibility into vendor and asset risk — all without the complexity of legacy GRC tools. With an intuitive, workflow-driven design, teams can easily conduct assessments, manage risks, and oversee their entire inventory of vendors and assets in one centralized platform.",
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
    { title: "Collaborating with Engineering (...Without Being That Person)", platform: "LinkedIn", url: "https://www.linkedin.com/posts/nathanim-philipos-9688a2274_collaborating-grc-with-engineering-activity-7398782484504817664-FLaG?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEMNHOABvbJFAK1jwvVUsTpkNl4fNvLCTCc" },
    { title: "Why Communication is Becoming the Most Underrated Skill in GRC", platform: "LinkedIn", url: "https://www.linkedin.com/posts/nathanim-philipos-9688a2274_communication-in-grc-activity-7401666515860905984-MBq4?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEMNHOABvbJFAK1jwvVUsTpkNl4fNvLCTCc" },
    { title: "Risk Assessments Made Simple", platform: "LinkedIn", url: "https://www.linkedin.com/posts/nathanim-philipos-9688a2274_theres-something-funny-about-risk-assessments-activity-7396970558292361217-nkFv?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEMNHOABvbJFAK1jwvVUsTpkNl4fNvLCTCc" },
    { title: "Why Continuous Vulnerability Monitoring is Essential: Passing an Audit vs Staying Secure", platform: "LinkedIn", url: "https://www.linkedin.com/posts/nathanim-philipos-9688a2274_continious-vulnerability-monitoring-activity-7394071435058667522-zK5E?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEMNHOABvbJFAK1jwvVUsTpkNl4fNvLCTCc" }
  ],
  articlesIntro: "I write GRC articles to help build a supportive community where we can learn from each other's mistakes and experiences. My goal is to make GRC easier to understand, lower the barrier to entry, and help people feel confident that they belong and are growing in this field."
}

const timelineData = [
  {
    year: 2018,
    title: "A New Beginning",
    content: "Moved from Ethiopia to the United States at age 14 to attend boarding school. My parents sacrificed everything to give me this opportunity for a better education."
  },
  {
    year: 2022,
    title: "College Begins",
    content: "Graduated high school and started my freshman year at Missouri State University, studying Information Technology & Cybersecurity."
  },
  {
    year: 2023,
    title: "First Steps into GRC",
    events: [
      {
        period: "May 2023 - Jan 2024",
        role: "Internal Audit Intern",
        company: "Office of Internal Audit",
        highlight: "Built a risk visualization heatmap that categorized risks from low to critical, saving auditors hours of planning time.",
        skills: ["Risk Assessments", "Audit Practices", "Automation"]
      },
      {
        period: "Fall 2023",
        note: "Applied to 50+ internships. Landed two roles."
      }
    ]
  },
  {
    year: 2024,
    title: "Growth Through Experience",
    events: [
      {
        period: "Jan - May 2024",
        role: "Technology Support Specialist",
        company: "The Whitlock Company",
        highlight: "Deepened my understanding of system architecture and support. Automation became my passion.",
        skills: ["System Architecture", "Technical Support", "Automation"]
      },
      {
        period: "May - June 2024",
        note: "Mission trip to Italy. This trip reignited my desire to grow in my field after proper rest."
      },
      {
        period: "June - Oct 2024",
        role: "IT Audit Intern",
        company: "Armanino LLP",
        highlight: "Grew in SOC 2 control testing and risk identification. Became very familiar with what testing looks like from an auditor's perspective.",
        skills: ["SOC 2", "Control Testing", "Risk Identification"]
      },
      {
        period: "Oct 2024 - Jan 2025",
        role: "IT SOC Audit Associate",
        company: "Copeland Buhl",
        highlight: "First associate role as a junior in college. Small team managing 18 audits at a time. Grew in SOC 2 & HITRUST testing.",
        skills: ["SOC 2", "HITRUST", "Audit Management"]
      }
    ]
  },
  {
    year: 2025,
    title: "Burnout, Recovery & Breakthrough",
    events: [
      {
        period: "January 2025",
        note: "First trip back to Ethiopia in 4 years. Reunited with family for a month. Much needed rest and rejuvenation."
      },
      {
        period: "March 2025",
        note: "Still at Copeland Buhl. Faced severe burnout and mental health challenges while balancing 17 audit engagements."
      },
      {
        period: "April 2025",
        note: "Experienced my first layoff. Decided to step away from tech to recover."
      },
      {
        period: "Spring 2025",
        role: "Barista",
        company: "Local Coffee Shop",
        highlight: "This role helped me recover, regain my love for working with people, and reflect on managing burnout. My passion for cybersecurity reignited."
      },
      {
        period: "July 2025",
        role: "GRC Professional",
        company: "SaltyCloud",
        highlight: "Built TenaGRC and presented it to SaltyCloud's CEO. Hired to run their first SOC 2 engagement. Finally transitioned from IT Audit to internal GRC.",
        skills: ["SOC 2 Type II", "GRC Program Management"]
      },
      {
        period: "September 2025",
        note: "SaltyCloud received their first SOC 2 Type II attestation under my leadership."
      }
    ]
  },
  {
    year: "2025-grad",
    title: "Graduation",
    content: "In December 2025, I graduated with honors with my Bachelor of Science in Information Technology & Cybersecurity, a moment made unforgettable by having my father there to witness his sacrifice come full circle. Walking across that stage represented years of discipline, resilience, and faith, and it remains one of the most meaningful milestones of my life. Graduating a semester early to begin working was incredibly challenging but well worth it.",
    subHeader: "But the job isn't finished...",
    subContent: "In May 2027, I will graduate with my MBA with a concentration in Cybersecurity Policy, continuing the journey of bridging technical execution with thoughtful governance and leadership.",
    isGraduation: true
  },
  {
    year: 2026,
    title: "Building Forward",
    content: "Running GovRAMP Moderate as a solo GRC analyst at a bootstrapped startup. Graduated from the Progressing Snapshot program. Now shooting for GovRAMP Moderate authorization."
  }
]

function PathTimeline() {
  const years = [2018, 2022, 2023, 2024, 2025, "2025-grad", 2026]
  const yearLabels = [2018, 2022, 2023, 2024, 2025, "Graduation", 2026]
  const [selectedYearIndex, setSelectedYearIndex] = useState(0)
  const sliderRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false)

  const triggerConfetti = useCallback(() => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#32CD32']
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#32CD32']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  const handleSliderChange = (e) => {
    const newIndex = parseInt(e.target.value)
    setSelectedYearIndex(newIndex)
    
    if (years[newIndex] === "2025-grad" && !hasTriggeredConfetti) {
      triggerConfetti()
      setHasTriggeredConfetti(true)
    }
    
    if (years[newIndex] !== "2025-grad") {
      setHasTriggeredConfetti(false)
    }
  }

  const currentYearData = timelineData.find(item => item.year === years[selectedYearIndex])

  return (
    <section className="bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <AnimatedSection>
          <h2 className="section-title">My Path Into GRC</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Drag the slider to explore my journey
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-black rounded-2xl p-8 md:p-12">
            <div className="relative mb-8">
              <div className="flex justify-between mb-4">
                {yearLabels.map((label, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedYearIndex(index)
                      if (years[index] === "2025-grad" && !hasTriggeredConfetti) {
                        triggerConfetti()
                        setHasTriggeredConfetti(true)
                      }
                      if (years[index] !== "2025-grad") {
                        setHasTriggeredConfetti(false)
                      }
                    }}
                    className={`text-sm font-bold transition-all duration-300 ${
                      index <= selectedYearIndex ? 'text-white' : 'text-gray-600'
                    } ${index === selectedYearIndex ? 'text-lg scale-110' : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              <div className="relative h-2 bg-gray-700 rounded-full">
                <motion.div 
                  className="absolute h-full bg-white rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(selectedYearIndex / (years.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <input
                ref={sliderRef}
                type="range"
                min="0"
                max={years.length - 1}
                value={selectedYearIndex}
                onChange={handleSliderChange}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="absolute top-0 w-full h-8 opacity-0 cursor-pointer"
                style={{ marginTop: '12px' }}
              />
              
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-4 border-black cursor-grab active:cursor-grabbing"
                style={{ 
                  left: `calc(${(selectedYearIndex / (years.length - 1)) * 100}% - 12px)`,
                  marginTop: '4px'
                }}
                animate={{ scale: isDragging ? 1.2 : 1 }}
                transition={{ duration: 0.2 }}
              />
            </div>

            <motion.div
              key={selectedYearIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-white min-h-[300px]"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                {years[selectedYearIndex] === "2025-grad" ? "2025" : years[selectedYearIndex]}
                {currentYearData?.isGraduation && <span className="ml-3">🎓</span>}
              </h3>
              {currentYearData && (
                <>
                  <p className="text-xl md:text-2xl font-semibold text-gray-300 mb-6">
                    {currentYearData.title}
                  </p>
                  
                  {currentYearData.content && (
                    <p className="text-gray-300 text-lg leading-relaxed">{currentYearData.content}</p>
                  )}
                  
                  {currentYearData.subHeader && (
                    <div className="mt-8">
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-4">{currentYearData.subHeader}</h4>
                      <p className="text-gray-300 text-lg leading-relaxed">{currentYearData.subContent}</p>
                    </div>
                  )}
                  
                  {currentYearData.events && (
                    <div className="space-y-6 mt-4">
                      {currentYearData.events.map((event, eventIndex) => (
                        <motion.div 
                          key={eventIndex} 
                          className="border-l-2 border-gray-600 pl-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: eventIndex * 0.1 }}
                        >
                          <p className="text-sm font-semibold text-gray-400 mb-1">{event.period}</p>
                          
                          {event.role && (
                            <p className="font-bold text-lg text-white">
                              {event.role} <span className="font-normal text-gray-400">@ {event.company}</span>
                            </p>
                          )}
                          
                          {event.highlight && (
                            <p className="text-gray-300 mt-1 leading-relaxed">{event.highlight}</p>
                          )}
                          
                          {event.note && !event.role && (
                            <p className="text-gray-300 italic">{event.note}</p>
                          )}
                          
                          {event.skills && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {event.skills.map((skill, skillIndex) => (
                                <span 
                                  key={skillIndex}
                                  className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {selectedYearIndex === years.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-10 pt-8 border-t border-gray-700"
                >
                  <p className="text-lg md:text-xl leading-relaxed font-medium text-gray-300">
                    My story is unique, just like yours — shaped by <span className="text-white">sacrifice</span>, <span className="text-white">burnout</span>, <span className="text-white">uncertainty</span>, incredible highs, and some very real lows.
                  </p>
                  <p className="text-xl md:text-2xl font-bold mt-6 text-white">
                    Don't minimize your path; leverage it.
                  </p>
                  <p className="text-gray-400 mt-4 text-lg">
                    Because your story is exactly what makes you <em>you</em>, and it's powerful enough to carry you forward.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
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
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 pb-8">
        <AnimatedSection>
          <h2 className="section-title">About Me</h2>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 mx-auto md:mx-0">
                  <img 
                    src="/profile.JPG" 
                    alt="Nathanim Philipos"
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {portfolioData.summary[0]}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {portfolioData.summary[1]}
                  </p>
                </div>
              </div>
            </AnimatedSection>
            
            {portfolioData.summary.slice(2).map((paragraph, index) => (
              <AnimatedSection key={index + 2} delay={(index + 2) * 0.1}>
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
              
              <h3 className="font-semibold text-lg mb-2">Featured Articles</h3>
              <p className="text-sm font-medium text-gray-700 mb-4 leading-relaxed">{portfolioData.articlesIntro}</p>
              <div className="space-y-3">
                {portfolioData.articles.map((article, index) => (
                  <a 
                    key={index}
                    href={article.url}
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
              <p className="text-xs text-gray-400 mt-4 italic">I appreciate feedback on my writing.</p>
            </div>
          </AnimatedSection>
        </div>
        
        {/* IsoraGRC Section */}
        <AnimatedSection delay={0.4}>
          <div className="mt-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <a href="https://saltycloud.com" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="/isora-logo.png" 
                    alt="IsoraGRC from SaltyCloud"
                    className="h-16 md:h-20 w-auto hover:opacity-80 transition-opacity"
                  />
                </a>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-3">Where I Work</h3>
                <p className="text-gray-600 leading-relaxed">
                  {portfolioData.isoraDescription}
                </p>
                <a 
                  href="https://saltycloud.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-black hover:underline"
                >
                  Learn more about IsoraGRC
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
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
        
        <div className="mt-16">
          <AnimatedSection delay={0.4}>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Award size={24} />
              Certifications
            </h3>
          </AnimatedSection>
          
          <AnimatedSection delay={0.5}>
            <div className="flex flex-wrap gap-8 items-start">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center w-48">
                <img 
                  src="/iso-42001-badge.jpeg" 
                  alt="ISO/IEC 42001:2023 Lead Auditor Certification"
                  className="w-32 h-32 object-contain mb-4"
                />
                <h4 className="font-bold text-lg">ISO/IEC 42001:2023</h4>
                <p className="text-gray-600 text-sm mt-1">Lead Auditor Certified</p>
              </div>
              <div className="flex-1 max-w-lg">
                <h4 className="font-semibold text-lg mb-3">What AI Governance Accomplishes</h4>
                <p className="text-gray-600 text-sm mb-4">ISO 42001 establishes a framework for responsible AI management, ensuring organizations deploy AI systems ethically and effectively.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span><strong>Risk Management</strong> — Identifies and mitigates AI-specific risks including bias, transparency, and accountability gaps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span><strong>Ethical Alignment</strong> — Ensures AI systems align with organizational values, regulatory requirements, and societal expectations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black font-bold">•</span>
                    <span><strong>Continuous Improvement</strong> — Establishes monitoring and audit processes to maintain AI system integrity over time</span>
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
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
            or just chatting. Feel free to reach out!
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
      <PathTimeline />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
