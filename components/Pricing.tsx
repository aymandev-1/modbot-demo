"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '£20',
    description: 'Perfect for simple scripts and basic bots.',
    features: [
      'Simple scripts & bots',
      'Up to 5 features',
      '1-2 day delivery',
      '1 revision round',
    ],
    cta: 'Order on Fiverr',
    ctaLink: '#',
    highlighted: false,
  },
  {
    name: 'Standard',
    price: '£50',
    description: 'For medium complexity projects with more features.',
    features: [
      'Medium complexity projects',
      'Up to 15 features',
      '3-5 day delivery',
      '3 revision rounds',
      'Source code included',
    ],
    cta: 'Get a Quote',
    ctaLink: '#contact',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '£100+',
    description: 'Complex systems and APIs with full support.',
    features: [
      'Complex systems & APIs',
      'Unlimited features',
      '5-7 day delivery',
      'Unlimited revisions',
      'Documentation included',
      'Priority support',
    ],
    cta: 'Get a Quote',
    ctaLink: '#contact',
    highlighted: false,
  },
]

function PricingCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-6 rounded-xl border ${
        plan.highlighted
          ? 'bg-card border-primary glow-primary'
          : 'bg-card border-border card-glow'
      }`}
    >
      {/* Popular badge */}
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold text-foreground">from {plan.price}</span>
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
            <Check className={`w-4 h-4 shrink-0 ${plan.highlighted ? 'text-primary' : 'text-green-500'}`} />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={plan.ctaLink}
        className={`block w-full py-3 text-center font-medium rounded-lg transition-all duration-300 ${
          plan.highlighted
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-foreground border border-border hover:border-primary/50'
        }`}
      >
        {plan.cta}
      </a>
    </motion.div>
  )
}

export default function Pricing() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section id="pricing" className="relative py-24 px-6">
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
            PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Choose the plan that fits your project. All prices are starting points — final quote depends on complexity.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
