"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Bot, Globe, Zap, Server, Database, Code2 } from 'lucide-react'

const services = [
  {
    icon: Bot,
    title: 'Discord Bots',
    description: 'Custom bots built with discord.py or JDA. Moderation, levelling, tickets, economy, API integrations.',
    price: '£20',
    features: ['discord.py / JDA', 'Moderation & Levelling', 'Tickets & Economy', 'API Integrations'],
  },
  {
    icon: Globe,
    title: 'Web Scrapers',
    description: 'Python scrapers for any public website. E-commerce, job boards, directories, news.',
    price: '£25',
    features: ['Any Public Website', 'E-commerce & Job Boards', 'CSV, JSON, Excel Output', 'Database Export'],
  },
  {
    icon: Zap,
    title: 'Automation Scripts',
    description: 'Automate repetitive tasks with Python. File processing, email parsing, report generation, scheduled jobs.',
    price: '£20',
    features: ['Task Automation', 'File Processing', 'Email Parsing', 'Scheduled Jobs'],
  },
  {
    icon: Server,
    title: 'REST APIs & Backend',
    description: 'Flask, FastAPI, or Spring Boot. Auth, database integration, documentation.',
    price: '£50',
    features: ['Flask / FastAPI / Spring Boot', 'Authentication', 'Database Integration', 'API Documentation'],
  },
  {
    icon: Database,
    title: 'Data Processing',
    description: 'Clean, transform, and merge messy datasets. CSV/Excel/JSON cleanup and formatting.',
    price: '£15',
    features: ['Data Cleaning', 'Dataset Transformation', 'Format Conversion', 'Pandas Pipelines'],
  },
  {
    icon: Code2,
    title: 'Custom Development',
    description: "Got something else in mind? I'll build it. Java or Python, any complexity.",
    price: '£30',
    features: ['Java & Python', 'Any Complexity', 'Custom Solutions', 'Full Flexibility'],
  },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
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
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/10 text-primary">
        <service.icon className="w-6 h-6" />
      </div>

      {/* Title and Price */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
        <span className="text-sm font-mono text-primary">from {service.price}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

      {/* Features */}
      <ul className="space-y-2">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-1 h-1 bg-primary rounded-full" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Hover gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}

export default function Services() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section id="services" className="relative py-24 px-6">
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
            SERVICES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            What I can build for you
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Specialising in backend development with Python and Java. From simple scripts to complex systems.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
