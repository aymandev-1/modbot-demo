"use client"

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { Send, Github, ExternalLink } from 'lucide-react'

const services = [
  'Discord Bots',
  'Web Scrapers',
  'Automation Scripts',
  'REST APIs & Backend',
  'Data Processing',
  'Custom Development',
]

const budgets = [
  '£20 - £50',
  '£50 - £100',
  '£100 - £250',
  '£250+',
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: '',
    budget: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormState({ name: '', email: '', service: '', budget: '', message: '' })
  }

  return (
    <section id="contact" className="relative py-24 px-6 bg-secondary/30">
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
            CONTACT
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Get a Quote
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Tell me about your project and I&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {submitted ? (
              <div className="p-8 bg-card rounded-xl border border-primary/50 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">
                  Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
                      Service
                    </label>
                    <select
                      id="service"
                      required
                      value={formState.service}
                      onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
                      Budget
                    </label>
                    <select
                      id="budget"
                      required
                      value={formState.budget}
                      onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select budget range</option>
                      {budgets.map((budget) => (
                        <option key={budget} value={budget}>{budget}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Project Description
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg glow-primary hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Alternative Contact */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Or find me on</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors duration-200"
                >
                  <ExternalLink className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">Fiverr</span>
                  <span className="ml-auto text-xs text-muted-foreground">@aymandev</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors duration-200"
                >
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Upwork</span>
                  <span className="ml-auto text-xs text-muted-foreground">@aymandev</span>
                </a>
                <a
                  href="https://github.com/aymandev-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors duration-200"
                >
                  <Github className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">GitHub</span>
                  <span className="ml-auto text-xs text-muted-foreground">github.com/aymandev-1</span>
                </a>
              </div>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">Direct Email</h3>
              <p className="text-muted-foreground mb-4">
                Prefer email? Drop me a message directly.
              </p>
              <a
                href="mailto:hello@aymandev.com"
                className="font-mono text-primary hover:underline"
              >
                hello@aymandev.com
              </a>
            </div>

            <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">Quick Response</h3>
              <p className="text-sm text-muted-foreground">
                I typically respond within 24 hours. For urgent projects, mention it in your message and I&apos;ll prioritise your request.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
