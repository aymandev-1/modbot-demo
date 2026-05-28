"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Github, ExternalLink } from 'lucide-react'

const projects = [
  {
    title: 'ModBot',
    description: 'A Discord moderation bot with 20+ slash commands. Features kick, ban, mute, warn system, auto-mod (spam/links/caps/word filter), welcome messages, event logging, server utilities.',
    tech: ['Python', 'discord.py', 'JSON Storage'],
    github: 'https://github.com/aymandev-1/modbot-demo',
    badge: 'Live Demo',
    badgeColor: 'bg-green-500/20 text-green-400',
  },
  {
    title: 'Secret Project',
    description: 'Something exciting is in the works. A new tool that will make web scraping effortless. Stay tuned for the reveal.',
    tech: ['Python', 'BeautifulSoup', 'Selenium'],
    github: 'https://github.com/aymandev-1',
    badge: 'Coming Soon',
    badgeColor: 'bg-accent/20 text-accent',
  },
  {
    title: 'Secret Project',
    description: 'Another project currently under development. This one focuses on backend infrastructure and API design. More details soon.',
    tech: ['Python', 'Flask', 'MongoDB', 'Docker'],
    github: 'https://github.com/aymandev-1',
    badge: 'Coming Soon',
    badgeColor: 'bg-accent/20 text-accent',
  },
]

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-6 bg-card rounded-xl border border-border card-glow"
    >
      {/* Badge */}
      <span className={`inline-block px-2 py-1 mb-4 text-xs font-mono rounded ${project.badgeColor}`}>
        {project.badge}
      </span>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground mb-3">{project.title}</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 text-xs font-mono text-muted-foreground bg-secondary rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-4">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
        >
          <Github className="w-4 h-4" />
          View Code
        </a>
        {project.badge === 'Live Demo' && (
          <a
            href="#modbot-demo"
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            See Demo
          </a>
        )}
      </div>

      {/* Hover gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}

export default function Portfolio() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section id="portfolio" className="relative py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full">
            PORTFOLIO
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Recent Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            A selection of projects showcasing my work in automation, bots, and backend development.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
