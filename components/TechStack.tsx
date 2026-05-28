"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const techStack = [
  { name: 'Python', category: 'Languages' },
  { name: 'Java', category: 'Languages' },
  { name: 'Flask', category: 'Frameworks' },
  { name: 'FastAPI', category: 'Frameworks' },
  { name: 'Spring Boot', category: 'Frameworks' },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'MySQL', category: 'Databases' },
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'SQLite', category: 'Databases' },
  { name: 'discord.py', category: 'Libraries' },
  { name: 'JDA', category: 'Libraries' },
  { name: 'BeautifulSoup', category: 'Libraries' },
  { name: 'Selenium', category: 'Libraries' },
  { name: 'Docker', category: 'Tools' },
  { name: 'Git', category: 'Tools' },
  { name: 'Linux', category: 'Tools' },
  { name: 'REST APIs', category: 'Concepts' },
]

export default function TechStack() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full">
            TECH STACK
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Technologies I Work With
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Battle-tested tools and frameworks for reliable, maintainable code.
          </p>
        </motion.div>

        {/* Tech Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="group relative px-4 py-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
            >
              <span className="font-mono text-sm text-foreground group-hover:text-primary transition-colors duration-300">
                {tech.name}
              </span>
              {/* Category tooltip on hover */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-muted-foreground bg-popover rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {tech.category}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
