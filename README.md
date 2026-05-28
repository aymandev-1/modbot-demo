# 🛡️ ModBot

A feature-rich Discord moderation bot built with discord.py. Handles moderation, auto-moderation, logging, welcome messages, and more — all configurable via slash commands.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![discord.py](https://img.shields.io/badge/discord.py-2.3+-5865F2?logo=discord&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🔨 Moderation
| Command | Description |
|---------|-------------|
| `/kick` | Kick a member with reason |
| `/ban` | Ban a member with optional message cleanup |
| `/unban` | Unban a user by ID |
| `/mute` | Timeout a member for a set duration |
| `/unmute` | Remove a member's timeout |
| `/warn` | Issue a warning (tracked per user) |
| `/warnings` | View a member's warning history |
| `/clearwarns` | Clear all warnings for a member |
| `/purge` | Bulk delete messages (with optional user filter) |
| `/slowmode` | Set channel slowmode |

### 🛡️ Auto-Moderation
- **Anti-Spam** — Detects rapid message spam, auto-mutes offenders
- **Anti-Links** — Blocks URLs and Discord invite links
- **Anti-Caps** — Filters excessive caps lock usage
- **Bad Word Filter** — Customisable blocked word list
- Configurable per-server with whitelisted roles and channels

### 👋 Welcome System
- Customisable welcome and leave messages
- Placeholder support: `{user}`, `{username}`, `{server}`, `{membercount}`
- Auto-role assignment on join
- Test command to preview messages

### 📋 Logging
Logs the following events to a configurable channel:
- Member joins and leaves
- Message edits and deletes
- Role changes
- Moderation actions

### 🔧 Utility
- `/ping` — Bot latency
- `/uptime` — How long the bot has been running
- `/serverinfo` — Detailed server information
- `/userinfo` — User profile and role information
- `/avatar` — Get any user's avatar in multiple formats

---

## 🚀 Setup

### Prerequisites
- Python 3.10 or higher
- A Discord bot token ([create one here](https://discord.com/developers/applications))

### Installation

```bash
# Clone the repo
git clone https://github.com/aymandev/modbot.git
cd modbot

# Install dependencies
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env and add your bot token

# Run
python bot.py
```

### Bot Permissions
When inviting the bot, make sure to grant:
- `Administrator` (recommended), or individually:
- Kick Members, Ban Members, Moderate Members
- Manage Messages, Manage Channels
- Read Messages, Send Messages
- Embed Links, Attach Files, Read Message History

### Required Intents
Enable these in the [Developer Portal](https://discord.com/developers/applications) under your bot's settings:
- ✅ Presence Intent
- ✅ Server Members Intent
- ✅ Message Content Intent

---

## 📁 Project Structure

```
modbot/
├── bot.py              # Entry point
├── requirements.txt    # Dependencies
├── .env.example        # Environment template
├── .gitignore
├── cogs/
│   ├── moderation.py   # Core mod commands
│   ├── automod.py      # Auto-moderation system
│   ├── logging.py      # Event logging
│   ├── welcome.py      # Welcome/leave messages
│   ├── utility.py      # General utilities
│   └── help.py         # Custom help command
└── utils/
    └── helpers.py       # Shared utilities
```

---

## ⚙️ Configuration

All configuration is done through slash commands — no config files to edit.

**Quick Start:**
1. `/setlogs #mod-logs` — Set up logging
2. `/welcome channel #welcome` — Set welcome channel
3. `/welcome message Welcome {user}! You're member #{membercount}` — Set message
4. `/automod status` — Check auto-mod settings

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 🔗 More Projects

Check out my other projects:

| Project | Description |
|---------|-------------|
| [flask-api](https://github.com/aymandev-1/flask-api) | Flask API project |
| [scrape-kit](https://github.com/aymandev-1/scrape-kit) | Web scraping toolkit |

---

**Built by [aymandev-1](https://github.com/aymandev-1)**
