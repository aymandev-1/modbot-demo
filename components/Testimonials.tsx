"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Incredibly fast turnaround and the code quality was excellent. The bot works flawlessly and exceeded my expectations. Will definitely hire again!",
    name: "Alex T.",
    role: "Discord Server Owner",
    rating: 5,
  },
  {
    quote: "Very professional and easy to work with. Delivered exactly what I needed with clear documentation. Highly recommended for any automation projects.",
    name: "Sarah M.",
    role: "E-commerce Store Owner",
    rating: 5,
  },
  {
    quote: "The API integration was done perfectly. Great communication throughout the project and the final product was better than I expected. 10/10!",
    name: "James K.",
    role: "Startup Founder",
    rating: 5,
  },
]

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-6 bg-card rounded-xl border border-border card-glow"
    >
      {/* Quote icon */}
      <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-muted-foreground leading-relaxed mb-6">
        &quot;{testimonial.quote}&quot;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-foreground">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>

      {/* Placeholder badge */}
      <div className="absolute bottom-6 right-6">
        <span className="text-xs text-muted-foreground/50 font-mono">Example Review</span>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24 px-6">
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
            TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            What Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Reviews from Fiverr and Upwork clients.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
