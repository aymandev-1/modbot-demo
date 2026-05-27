import time
from datetime import datetime, timezone

import discord
from discord import app_commands
from discord.ext import commands

from utils.helpers import info_embed


class Utility(commands.Cog):
    """General utility commands."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.start_time = time.time()

    # ── Ping ──────────────────────────────────────────

    @app_commands.command(name="ping", description="Check bot latency")
    async def ping(self, interaction: discord.Interaction):
        latency = round(self.bot.latency * 1000)
        embed = info_embed("Pong!", f"Latency: **{latency}ms**")
        await interaction.response.send_message(embed=embed)

    # ── Uptime ────────────────────────────────────────

    @app_commands.command(name="uptime", description="Check how long the bot has been running")
    async def uptime(self, interaction: discord.Interaction):
        elapsed = int(time.time() - self.start_time)
        days, remainder = divmod(elapsed, 86400)
        hours, remainder = divmod(remainder, 3600)
        minutes, seconds = divmod(remainder, 60)

        parts = []
        if days:
            parts.append(f"{days}d")
        if hours:
            parts.append(f"{hours}h")
        if minutes:
            parts.append(f"{minutes}m")
        parts.append(f"{seconds}s")

        embed = info_embed("Uptime", f"Bot has been online for **{' '.join(parts)}**")
        await interaction.response.send_message(embed=embed)

    # ── Server Info ───────────────────────────────────

    @app_commands.command(name="serverinfo", description="Display server information")
    async def serverinfo(self, interaction: discord.Interaction):
        guild = interaction.guild

        embed = discord.Embed(title=guild.name, colour=0x3498DB)

        if guild.icon:
            embed.set_thumbnail(url=guild.icon.url)

        embed.add_field(name="Owner", value=guild.owner.mention if guild.owner else "Unknown", inline=True)
        embed.add_field(name="Members", value=f"{guild.member_count}", inline=True)
        embed.add_field(name="Roles", value=f"{len(guild.roles)}", inline=True)
        embed.add_field(name="Text Channels", value=f"{len(guild.text_channels)}", inline=True)
        embed.add_field(name="Voice Channels", value=f"{len(guild.voice_channels)}", inline=True)
        embed.add_field(name="Boost Level", value=f"Tier {guild.premium_tier}", inline=True)
        embed.add_field(
            name="Created",
            value=f"<t:{int(guild.created_at.timestamp())}:F>",
            inline=False,
        )
        embed.set_footer(text=f"ID: {guild.id}")

        await interaction.response.send_message(embed=embed)

    # ── User Info ─────────────────────────────────────

    @app_commands.command(name="userinfo", description="Display user information")
    @app_commands.describe(member="User to look up (defaults to you)")
    async def userinfo(self, interaction: discord.Interaction, member: discord.Member = None):
        member = member or interaction.user

        embed = discord.Embed(title=str(member), colour=member.colour or 0x3498DB)
        embed.set_thumbnail(url=member.display_avatar.url)

        embed.add_field(name="ID", value=member.id, inline=True)
        embed.add_field(name="Nickname", value=member.nick or "None", inline=True)
        embed.add_field(name="Bot", value="Yes" if member.bot else "No", inline=True)
        embed.add_field(
            name="Account Created",
            value=f"<t:{int(member.created_at.timestamp())}:R>",
            inline=True,
        )
        embed.add_field(
            name="Joined Server",
            value=f"<t:{int(member.joined_at.timestamp())}:R>" if member.joined_at else "Unknown",
            inline=True,
        )

        roles = [r.mention for r in member.roles if r != interaction.guild.default_role]
        roles_text = ", ".join(roles[:15]) if roles else "None"
        if len(roles) > 15:
            roles_text += f" ... and {len(roles) - 15} more"
        embed.add_field(name=f"Roles ({len(roles)})", value=roles_text, inline=False)

        embed.add_field(name="Top Role", value=member.top_role.mention, inline=True)

        await interaction.response.send_message(embed=embed)

    # ── Avatar ────────────────────────────────────────

    @app_commands.command(name="avatar", description="Display a user's avatar")
    @app_commands.describe(member="User to get avatar for")
    async def avatar(self, interaction: discord.Interaction, member: discord.Member = None):
        member = member or interaction.user

        embed = discord.Embed(title=f"{member}'s Avatar", colour=member.colour or 0x3498DB)
        embed.set_image(url=member.display_avatar.url)

        links = []
        for fmt in ("png", "jpg", "webp"):
            links.append(f"[{fmt.upper()}]({member.display_avatar.with_format(fmt).url})")
        if member.display_avatar.is_animated():
            links.append(f"[GIF]({member.display_avatar.with_format('gif').url})")

        embed.description = " | ".join(links)
        await interaction.response.send_message(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(Utility(bot))
