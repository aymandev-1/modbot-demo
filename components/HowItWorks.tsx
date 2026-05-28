"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, Code2, Package } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'Tell me what you need',
    description: 'Describe your project and requirements. I\'ll give you a free quote within 24 hours with a clear breakdown of what\'s included.',
  },
  {
    icon: Code2,
    step: '02',
    title: 'I build it',
    description: 'Fast development with regular updates so you know exactly what\'s happening. No surprises, just progress.',
  },
  {
    icon: Package,
    step: '03',
    title: 'You get clean code',
    description: 'Delivered with documentation, tested, and ready to deploy. Full source code ownership — it\'s yours to keep.',
  },
]

export default function HowItWorks() {
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
            PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            A simple, transparent process from start to finish.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
              )}

              {/* Icon */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-6" />
                <div className="relative bg-card rounded-2xl w-full h-full flex items-center justify-center border border-border">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-full flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
