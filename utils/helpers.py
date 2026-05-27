import re
from datetime import timedelta
from typing import Optional

import discord


COLOURS = {
    "success": 0x2ECC71,
    "error": 0xE74C3C,
    "warning": 0xF39C12,
    "info": 0x3498DB,
    "moderation": 0xE67E22,
    "log": 0x95A5A6,
}


def success_embed(title: str, description: str = "") -> discord.Embed:
    return discord.Embed(title=f"✅ {title}", description=description, colour=COLOURS["success"])


def error_embed(title: str, description: str = "") -> discord.Embed:
    return discord.Embed(title=f"❌ {title}", description=description, colour=COLOURS["error"])


def mod_embed(title: str, description: str = "") -> discord.Embed:
    return discord.Embed(title=f"🔨 {title}", description=description, colour=COLOURS["moderation"])


def info_embed(title: str, description: str = "") -> discord.Embed:
    return discord.Embed(title=f"ℹ️ {title}", description=description, colour=COLOURS["info"])


def log_embed(title: str, description: str = "") -> discord.Embed:
    return discord.Embed(title=f"📋 {title}", description=description, colour=COLOURS["log"])


def parse_duration(text: str) -> Optional[timedelta]:
    """Parse a duration string like '10m', '2h', '1d' into a timedelta."""
    pattern = re.compile(r"(\d+)([smhd])")
    matches = pattern.findall(text.lower())
    if not matches:
        return None

    total_seconds = 0
    units = {"s": 1, "m": 60, "h": 3600, "d": 86400}

    for value, unit in matches:
        total_seconds += int(value) * units[unit]

    return timedelta(seconds=total_seconds) if total_seconds > 0 else None


def format_duration(delta: timedelta) -> str:
    """Format a timedelta into a readable string."""
    total = int(delta.total_seconds())
    days, remainder = divmod(total, 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)

    parts = []
    if days:
        parts.append(f"{days}d")
    if hours:
        parts.append(f"{hours}h")
    if minutes:
        parts.append(f"{minutes}m")
    if seconds and not days:
        parts.append(f"{seconds}s")

    return " ".join(parts) if parts else "0s"
