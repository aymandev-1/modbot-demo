"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Github, ExternalLink, Shield, Bell, Terminal, Users } from 'lucide-react'

const chatMessages = [
  {
    user: 'Moderator',
    avatar: 'M',
    command: '/kick @spammer',
    response: {
      color: 'border-l-green-500',
      icon: '✅',
      title: 'Member Kicked',
      description: 'spammer was kicked from the server.',
      fields: [{ name: 'Reason', value: 'Spam' }],
    },
  },
  {
    user: 'Admin',
    avatar: 'A',
    command: '/automod status',
    response: {
      color: 'border-l-primary',
      icon: '🛡️',
      title: 'Auto-Moderation Status',
      description: 'Current auto-mod settings for this server.',
      fields: [
        { name: 'Anti-Spam', value: '🟢 On' },
        { name: 'Anti-Links', value: '🔴 Off' },
        { name: 'Anti-Caps', value: '🟢 On' },
      ],
    },
  },
  {
    user: 'Moderator',
    avatar: 'M',
    command: '/warn @user Breaking rules',
    response: {
      color: 'border-l-yellow-500',
      icon: '⚠️',
      title: 'Warning Issued',
      description: 'user has been warned.',
      fields: [
        { name: 'Reason', value: 'Breaking rules' },
        { name: 'Total Warnings', value: '3' },
      ],
    },
  },
]

const features = [
  { icon: Terminal, label: '20+ Commands', description: 'Comprehensive moderation toolkit' },
  { icon: Shield, label: 'Auto-Moderation', description: 'Spam, links, caps filtering' },
  { icon: Bell, label: 'Event Logging', description: 'Track all server activity' },
  { icon: Users, label: 'Welcome System', description: 'Greet new members' },
]

function DiscordMessage({ message, index, isVisible }: { message: typeof chatMessages[0]; index: number; isVisible: boolean }) {
  const [showCommand, setShowCommand] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [typedCommand, setTypedCommand] = useState('')

  useEffect(() => {
    if (!isVisible) {
      setShowCommand(false)
      setShowResponse(false)
      setTypedCommand('')
      return
    }

    const commandDelay = index * 3000
    const responseDelay = commandDelay + 1500

    const commandTimer = setTimeout(() => {
      setShowCommand(true)
      let i = 0
      const typeInterval = setInterval(() => {
        if (i <= message.command.length) {
          setTypedCommand(message.command.slice(0, i))
          i++
        } else {
          clearInterval(typeInterval)
        }
      }, 30)
    }, commandDelay)

    const responseTimer = setTimeout(() => {
      setShowResponse(true)
    }, responseDelay)

    return () => {
      clearTimeout(commandTimer)
      clearTimeout(responseTimer)
    }
  }, [isVisible, index, message.command])

  if (!showCommand) return null

  return (
    <div className="space-y-3">
      {/* User Command */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-sm font-semibold text-accent shrink-0">
          {message.avatar}
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-foreground">{message.user}</span>
            <span className="text-xs text-muted-foreground">Today at 12:00</span>
          </div>
          <p className="font-mono text-sm text-primary">{typedCommand}<span className="animate-pulse">|</span></p>
        </div>
      </div>

      {/* Bot Response */}
      {showResponse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-3 ml-0"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
            MB
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-primary">ModBot</span>
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/20 text-primary rounded">BOT</span>
              <span className="text-xs text-muted-foreground">Today at 12:00</span>
            </div>
            {/* Embed */}
            <div className={`mt-2 p-4 bg-secondary/50 rounded-lg border-l-4 ${message.response.color} max-w-md`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{message.response.icon}</span>
                <span className="font-semibold text-foreground">{message.response.title}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{message.response.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {message.response.fields.map((field, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-muted-foreground">{field.name}: </span>
                    <span className="text-foreground font-medium">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function ModBotDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isInView) {
      setAnimationKey((k) => k + 1)
    }
  }, [isInView])

  return (
    <section id="modbot-demo" className="relative py-24 px-6">
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
            LIVE DEMO
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            ModBot in Action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            See how ModBot handles moderation commands in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Discord-style chat window */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0d0d12] rounded-xl border border-border overflow-hidden"
          >
            {/* Window Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="ml-2 text-sm text-muted-foreground font-mono"># moderation-logs</span>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-6 min-h-[400px]">
              {chatMessages.map((message, index) => (
                <DiscordMessage
                  key={`${animationKey}-${index}`}
                  message={message}
                  index={index}
                  isVisible={isInView}
                />
              ))}
            </div>
          </motion.div>

          {/* Features and CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="p-4 bg-card rounded-xl border border-border"
                >
                  <feature.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">{feature.label}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3">Full-Featured Moderation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                ModBot is a complete Discord moderation solution with slash commands, auto-moderation, 
                warning systems, event logging, and much more. Built with Python and discord.py for 
                reliability and performance.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Python', 'discord.py', 'Slash Commands', 'JSON Storage'].map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs font-mono text-muted-foreground bg-secondary rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://discord.com/oauth2/authorize?client_id=1509282945725235480"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg glow-primary hover:bg-primary/90 transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                Add to Your Server
              </a>
              <a
                href="https://github.com/aymandev-1/modbot-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-foreground font-medium rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
