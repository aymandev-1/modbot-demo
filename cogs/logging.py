import json
import os
from datetime import datetime, timezone

import discord
from discord import app_commands
from discord.ext import commands

from utils.helpers import log_embed

CONFIG_FILE = "data/log_config.json"


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


class Logging(commands.Cog):
    """Server event logging."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    async def _get_log_channel(self, guild: discord.Guild):
        configs = _load_config()
        guild_id = str(guild.id)
        channel_id = configs.get(guild_id, {}).get("log_channel")
        if channel_id:
            return guild.get_channel(channel_id)
        return None

    # ── Set log channel ───────────────────────────────

    @app_commands.command(name="setlogs", description="Set the channel for mod logs")
    @app_commands.describe(channel="Channel to send logs to")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def setlogs(self, interaction: discord.Interaction, channel: discord.TextChannel):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        if guild_id not in configs:
            configs[guild_id] = {}
        configs[guild_id]["log_channel"] = channel.id
        _save_config(configs)

        embed = discord.Embed(
            title="✅ Log Channel Set",
            description=f"Mod logs will be sent to {channel.mention}",
            colour=0x2ECC71,
        )
        await interaction.response.send_message(embed=embed)

    # ── Member join ───────────────────────────────────

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        log_channel = await self._get_log_channel(member.guild)
        if not log_channel:
            return

        embed = log_embed("Member Joined")
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.add_field(name="User", value=f"{member.mention} ({member})", inline=True)
        embed.add_field(name="ID", value=member.id, inline=True)
        embed.add_field(
            name="Account Created",
            value=f"<t:{int(member.created_at.timestamp())}:R>",
            inline=True,
        )
        embed.timestamp = datetime.now(timezone.utc)
        await log_channel.send(embed=embed)

    # ── Member leave ──────────────────────────────────

    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member):
        log_channel = await self._get_log_channel(member.guild)
        if not log_channel:
            return

        embed = log_embed("Member Left")
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.add_field(name="User", value=f"{member.mention} ({member})", inline=True)
        embed.add_field(name="ID", value=member.id, inline=True)
        roles = [r.mention for r in member.roles if r != member.guild.default_role]
        embed.add_field(
            name="Roles",
            value=", ".join(roles[:10]) if roles else "None",
            inline=False,
        )
        embed.timestamp = datetime.now(timezone.utc)
        await log_channel.send(embed=embed)

    # ── Message delete ────────────────────────────────

    @commands.Cog.listener()
    async def on_message_delete(self, message: discord.Message):
        if message.author.bot or not message.guild:
            return

        log_channel = await self._get_log_channel(message.guild)
        if not log_channel:
            return

        embed = log_embed("Message Deleted")
        embed.add_field(name="Author", value=f"{message.author.mention}", inline=True)
        embed.add_field(name="Channel", value=message.channel.mention, inline=True)

        content = message.content or "*No text content*"
        if len(content) > 1024:
            content = content[:1021] + "..."
        embed.add_field(name="Content", value=content, inline=False)

        if message.attachments:
            embed.add_field(
                name="Attachments",
                value="\n".join(a.filename for a in message.attachments),
                inline=False,
            )

        embed.timestamp = datetime.now(timezone.utc)
        await log_channel.send(embed=embed)

    # ── Message edit ──────────────────────────────────

    @commands.Cog.listener()
    async def on_message_edit(self, before: discord.Message, after: discord.Message):
        if before.author.bot or not before.guild:
            return
        if before.content == after.content:
            return

        log_channel = await self._get_log_channel(before.guild)
        if not log_channel:
            return

        embed = log_embed("Message Edited")
        embed.add_field(name="Author", value=f"{before.author.mention}", inline=True)
        embed.add_field(name="Channel", value=before.channel.mention, inline=True)
        embed.add_field(
            name="Jump",
            value=f"[Go to message]({after.jump_url})",
            inline=True,
        )

        before_content = before.content or "*Empty*"
        after_content = after.content or "*Empty*"
        if len(before_content) > 512:
            before_content = before_content[:509] + "..."
        if len(after_content) > 512:
            after_content = after_content[:509] + "..."

        embed.add_field(name="Before", value=before_content, inline=False)
        embed.add_field(name="After", value=after_content, inline=False)
        embed.timestamp = datetime.now(timezone.utc)
        await log_channel.send(embed=embed)

    # ── Role changes ──────────────────────────────────

    @commands.Cog.listener()
    async def on_member_update(self, before: discord.Member, after: discord.Member):
        if before.roles == after.roles:
            return

        log_channel = await self._get_log_channel(before.guild)
        if not log_channel:
            return

        added = set(after.roles) - set(before.roles)
        removed = set(before.roles) - set(after.roles)

        if added or removed:
            embed = log_embed("Roles Updated")
            embed.add_field(name="Member", value=f"{after.mention} ({after})", inline=True)

            if added:
                embed.add_field(
                    name="Added",
                    value=", ".join(r.mention for r in added),
                    inline=False,
                )
            if removed:
                embed.add_field(
                    name="Removed",
                    value=", ".join(r.mention for r in removed),
                    inline=False,
                )

            embed.timestamp = datetime.now(timezone.utc)
            await log_channel.send(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(Logging(bot))
