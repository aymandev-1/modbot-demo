import json
import os
import time
from collections import defaultdict
from typing import Optional

import discord
from discord import app_commands
from discord.ext import commands

from utils.helpers import error_embed, success_embed, mod_embed

CONFIG_FILE = "data/automod_config.json"

DEFAULT_CONFIG = {
    "enabled": True,
    "anti_spam": True,
    "anti_links": False,
    "anti_caps": True,
    "anti_badwords": True,
    "spam_threshold": 5,
    "spam_interval": 5,
    "caps_percentage": 70,
    "caps_min_length": 10,
    "badwords": ["slur_placeholder"],
    "whitelisted_roles": [],
    "whitelisted_channels": [],
    "log_channel": None,
}


def _load_config() -> dict:
    os.makedirs("data", exist_ok=True)
    if not os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "w") as f:
            json.dump({}, f)
    with open(CONFIG_FILE) as f:
        return json.load(f)


def _save_config(data: dict):
    os.makedirs("data", exist_ok=True)
    with open(CONFIG_FILE, "w") as f:
        json.dump(data, f, indent=2)


def _get_guild_config(guild_id: str) -> dict:
    configs = _load_config()
    if guild_id not in configs:
        configs[guild_id] = DEFAULT_CONFIG.copy()
        _save_config(configs)
    return configs[guild_id]


class AutoMod(commands.Cog):
    """Automatic moderation — spam, links, caps, and bad words."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.message_tracker: dict[int, list[float]] = defaultdict(list)

    def _is_whitelisted(self, message: discord.Message, config: dict) -> bool:
        """Check if user or channel is whitelisted."""
        if message.author.guild_permissions.manage_messages:
            return True
        if message.channel.id in config.get("whitelisted_channels", []):
            return True
        user_role_ids = {r.id for r in message.author.roles}
        if user_role_ids & set(config.get("whitelisted_roles", [])):
            return True
        return False

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        if message.author.bot or not message.guild:
            return

        guild_id = str(message.guild.id)
        config = _get_guild_config(guild_id)

        if not config.get("enabled", True):
            return

        if self._is_whitelisted(message, config):
            return

        # ── Anti-Spam ─────────────────────────
        if config.get("anti_spam", True):
            now = time.time()
            uid = message.author.id
            self.message_tracker[uid] = [
                t for t in self.message_tracker[uid]
                if now - t < config.get("spam_interval", 5)
            ]
            self.message_tracker[uid].append(now)

            if len(self.message_tracker[uid]) >= config.get("spam_threshold", 5):
                await message.channel.purge(
                    limit=config.get("spam_threshold", 5),
                    check=lambda m: m.author.id == uid,
                )
                self.message_tracker[uid].clear()
                try:
                    await message.author.timeout(
                        discord.utils.utcnow().replace(second=0) - discord.utils.utcnow() + __import__("datetime").timedelta(minutes=5),
                        reason="Auto-mod: spam detected",
                    )
                except Exception:
                    pass

                embed = mod_embed("Spam Detected", f"**{message.author}** was muted for 5 minutes (spam).")
                await message.channel.send(embed=embed, delete_after=10)
                return

        # ── Anti-Links ────────────────────────
        if config.get("anti_links", False):
            import re

            url_pattern = re.compile(r"https?://\S+|discord\.gg/\S+")
            if url_pattern.search(message.content):
                await message.delete()
                embed = mod_embed("Link Removed", f"{message.author.mention}, links are not allowed in this channel.")
                await message.channel.send(embed=embed, delete_after=5)
                return

        # ── Anti-Caps ─────────────────────────
        if config.get("anti_caps", True):
            text = message.content
            min_len = config.get("caps_min_length", 10)
            threshold = config.get("caps_percentage", 70)

            if len(text) >= min_len:
                alpha_chars = [c for c in text if c.isalpha()]
                if alpha_chars:
                    caps_ratio = sum(1 for c in alpha_chars if c.isupper()) / len(alpha_chars) * 100
                    if caps_ratio >= threshold:
                        await message.delete()
                        embed = mod_embed("Caps Filter", f"{message.author.mention}, please don't use excessive caps.")
                        await message.channel.send(embed=embed, delete_after=5)
                        return

        # ── Bad Words ─────────────────────────
        if config.get("anti_badwords", True):
            badwords = config.get("badwords", [])
            content_lower = message.content.lower()
            for word in badwords:
                if word.lower() in content_lower:
                    await message.delete()
                    embed = mod_embed("Filtered", f"{message.author.mention}, your message contained a blocked word.")
                    await message.channel.send(embed=embed, delete_after=5)
                    return

    # ── Configuration Commands ────────────────────────

    automod_group = app_commands.Group(name="automod", description="Configure auto-moderation settings")

    @automod_group.command(name="toggle", description="Enable or disable auto-moderation")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def toggle(self, interaction: discord.Interaction):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        if guild_id not in configs:
            configs[guild_id] = DEFAULT_CONFIG.copy()

        configs[guild_id]["enabled"] = not configs[guild_id]["enabled"]
        _save_config(configs)

        state = "enabled" if configs[guild_id]["enabled"] else "disabled"
        await interaction.response.send_message(
            embed=success_embed("Auto-Mod", f"Auto-moderation has been **{state}**.")
        )

    @automod_group.command(name="antispam", description="Toggle anti-spam filter")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def antispam(self, interaction: discord.Interaction):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        if guild_id not in configs:
            configs[guild_id] = DEFAULT_CONFIG.copy()

        configs[guild_id]["anti_spam"] = not configs[guild_id].get("anti_spam", True)
        _save_config(configs)

        state = "enabled" if configs[guild_id]["anti_spam"] else "disabled"
        await interaction.response.send_message(
            embed=success_embed("Anti-Spam", f"Anti-spam has been **{state}**.")
        )

    @automod_group.command(name="antilinks", description="Toggle anti-links filter")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def antilinks(self, interaction: discord.Interaction):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        if guild_id not in configs:
            configs[guild_id] = DEFAULT_CONFIG.copy()

        configs[guild_id]["anti_links"] = not configs[guild_id].get("anti_links", False)
        _save_config(configs)

        state = "enabled" if configs[guild_id]["anti_links"] else "disabled"
        await interaction.response.send_message(
            embed=success_embed("Anti-Links", f"Anti-links has been **{state}**.")
        )

    @automod_group.command(name="addword", description="Add a word to the filter list")
    @app_commands.describe(word="Word to block")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def addword(self, interaction: discord.Interaction, word: str):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        if guild_id not in configs:
            configs[guild_id] = DEFAULT_CONFIG.copy()

        if word.lower() not in [w.lower() for w in configs[guild_id].get("badwords", [])]:
            configs[guild_id].setdefault("badwords", []).append(word.lower())
            _save_config(configs)

        await interaction.response.send_message(
            embed=success_embed("Word Added", f"**{word}** has been added to the filter."),
            ephemeral=True,
        )

    @automod_group.command(name="removeword", description="Remove a word from the filter list")
    @app_commands.describe(word="Word to unblock")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def removeword(self, interaction: discord.Interaction, word: str):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        config = configs.get(guild_id, DEFAULT_CONFIG.copy())

        badwords = config.get("badwords", [])
        badwords = [w for w in badwords if w.lower() != word.lower()]
        config["badwords"] = badwords
        configs[guild_id] = config
        _save_config(configs)

        await interaction.response.send_message(
            embed=success_embed("Word Removed", f"**{word}** has been removed from the filter."),
            ephemeral=True,
        )

    @automod_group.command(name="status", description="View current auto-mod settings")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def status(self, interaction: discord.Interaction):
        guild_id = str(interaction.guild.id)
        config = _get_guild_config(guild_id)

        on = "🟢 On"
        off = "🔴 Off"

        embed = discord.Embed(title="🛡️ Auto-Mod Status", colour=0x3498DB)
        embed.add_field(name="Auto-Mod", value=on if config.get("enabled") else off, inline=True)
        embed.add_field(name="Anti-Spam", value=on if config.get("anti_spam") else off, inline=True)
        embed.add_field(name="Anti-Links", value=on if config.get("anti_links") else off, inline=True)
        embed.add_field(name="Anti-Caps", value=on if config.get("anti_caps") else off, inline=True)
        embed.add_field(name="Bad Words", value=on if config.get("anti_badwords") else off, inline=True)
        embed.add_field(
            name="Blocked Words",
            value=f"{len(config.get('badwords', []))} words",
            inline=True,
        )

        await interaction.response.send_message(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(AutoMod(bot))
