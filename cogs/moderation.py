import json
import os
from datetime import datetime, timezone
from typing import Optional

import discord
from discord import app_commands
from discord.ext import commands, tasks

from utils.helpers import (
    error_embed,
    format_duration,
    mod_embed,
    parse_duration,
    success_embed,
)

WARNS_FILE = "data/warns.json"
MUTES_FILE = "data/mutes.json"


def _ensure_data():
    os.makedirs("data", exist_ok=True)
    for f in (WARNS_FILE, MUTES_FILE):
        if not os.path.exists(f):
            with open(f, "w") as fp:
                json.dump({}, fp)


def _load(path: str) -> dict:
    _ensure_data()
    with open(path) as f:
        return json.load(f)


def _save(path: str, data: dict):
    _ensure_data()
    with open(path, "w") as f:
        json.dump(data, f, indent=2, default=str)


class Moderation(commands.Cog):
    """Core moderation commands."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.check_mutes.start()

    def cog_unload(self):
        self.check_mutes.cancel()

    # ── Kick ──────────────────────────────────────────

    @app_commands.command(name="kick", description="Kick a member from the server")
    @app_commands.describe(member="Member to kick", reason="Reason for kicking")
    @app_commands.checks.has_permissions(kick_members=True)
    async def kick(
        self,
        interaction: discord.Interaction,
        member: discord.Member,
        reason: Optional[str] = "No reason provided",
    ):
        if member.top_role >= interaction.user.top_role:
            return await interaction.response.send_message(
                embed=error_embed("Cannot kick", "That member has an equal or higher role than you."),
                ephemeral=True,
            )

        try:
            await member.send(
                embed=mod_embed("Kicked", f"You were kicked from **{interaction.guild.name}**\nReason: {reason}")
            )
        except discord.Forbidden:
            pass

        await member.kick(reason=f"{interaction.user}: {reason}")
        await interaction.response.send_message(
            embed=success_embed("Member Kicked", f"**{member}** was kicked.\nReason: {reason}")
        )

    # ── Ban ───────────────────────────────────────────

    @app_commands.command(name="ban", description="Ban a member from the server")
    @app_commands.describe(member="Member to ban", reason="Reason for banning", delete_days="Days of messages to delete (0-7)")
    @app_commands.checks.has_permissions(ban_members=True)
    async def ban(
        self,
        interaction: discord.Interaction,
        member: discord.Member,
        reason: Optional[str] = "No reason provided",
        delete_days: Optional[int] = 0,
    ):
        if member.top_role >= interaction.user.top_role:
            return await interaction.response.send_message(
                embed=error_embed("Cannot ban", "That member has an equal or higher role than you."),
                ephemeral=True,
            )

        delete_days = max(0, min(7, delete_days or 0))

        try:
            await member.send(
                embed=mod_embed("Banned", f"You were banned from **{interaction.guild.name}**\nReason: {reason}")
            )
        except discord.Forbidden:
            pass

        await member.ban(reason=f"{interaction.user}: {reason}", delete_message_days=delete_days)
        await interaction.response.send_message(
            embed=success_embed("Member Banned", f"**{member}** was banned.\nReason: {reason}")
        )

    # ── Unban ─────────────────────────────────────────

    @app_commands.command(name="unban", description="Unban a user by ID")
    @app_commands.describe(user_id="The user's Discord ID", reason="Reason for unbanning")
    @app_commands.checks.has_permissions(ban_members=True)
    async def unban(
        self,
        interaction: discord.Interaction,
        user_id: str,
        reason: Optional[str] = "No reason provided",
    ):
        try:
            user = await self.bot.fetch_user(int(user_id))
            await interaction.guild.unban(user, reason=f"{interaction.user}: {reason}")
            await interaction.response.send_message(
                embed=success_embed("User Unbanned", f"**{user}** has been unbanned.\nReason: {reason}")
            )
        except (ValueError, discord.NotFound):
            await interaction.response.send_message(
                embed=error_embed("Not Found", "Could not find a banned user with that ID."),
                ephemeral=True,
            )

    # ── Timeout / Mute ────────────────────────────────

    @app_commands.command(name="mute", description="Timeout a member for a duration")
    @app_commands.describe(member="Member to mute", duration="Duration (e.g. 10m, 2h, 1d)", reason="Reason")
    @app_commands.checks.has_permissions(moderate_members=True)
    async def mute(
        self,
        interaction: discord.Interaction,
        member: discord.Member,
        duration: str,
        reason: Optional[str] = "No reason provided",
    ):
        delta = parse_duration(duration)
        if not delta:
            return await interaction.response.send_message(
                embed=error_embed("Invalid Duration", "Use format like `10m`, `2h`, `1d`."),
                ephemeral=True,
            )

        if member.top_role >= interaction.user.top_role:
            return await interaction.response.send_message(
                embed=error_embed("Cannot mute", "That member has an equal or higher role than you."),
                ephemeral=True,
            )

        await member.timeout(delta, reason=f"{interaction.user}: {reason}")

        # Store mute data
        mutes = _load(MUTES_FILE)
        guild_id = str(interaction.guild.id)
        if guild_id not in mutes:
            mutes[guild_id] = []
        mutes[guild_id].append({
            "user_id": member.id,
            "moderator_id": interaction.user.id,
            "reason": reason,
            "duration": str(delta),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })
        _save(MUTES_FILE, mutes)

        readable = format_duration(delta)
        try:
            await member.send(
                embed=mod_embed("Muted", f"You were muted in **{interaction.guild.name}** for {readable}\nReason: {reason}")
            )
        except discord.Forbidden:
            pass

        await interaction.response.send_message(
            embed=success_embed("Member Muted", f"**{member}** muted for **{readable}**.\nReason: {reason}")
        )

    # ── Unmute ────────────────────────────────────────

    @app_commands.command(name="unmute", description="Remove timeout from a member")
    @app_commands.describe(member="Member to unmute")
    @app_commands.checks.has_permissions(moderate_members=True)
    async def unmute(self, interaction: discord.Interaction, member: discord.Member):
        await member.timeout(None)
        await interaction.response.send_message(
            embed=success_embed("Member Unmuted", f"**{member}** has been unmuted.")
        )

    # ── Warn ──────────────────────────────────────────

    @app_commands.command(name="warn", description="Issue a warning to a member")
    @app_commands.describe(member="Member to warn", reason="Reason for warning")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def warn(
        self,
        interaction: discord.Interaction,
        member: discord.Member,
        reason: Optional[str] = "No reason provided",
    ):
        warns = _load(WARNS_FILE)
        guild_id = str(interaction.guild.id)
        user_id = str(member.id)

        if guild_id not in warns:
            warns[guild_id] = {}
        if user_id not in warns[guild_id]:
            warns[guild_id][user_id] = []

        warn_entry = {
            "reason": reason,
            "moderator_id": interaction.user.id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        warns[guild_id][user_id].append(warn_entry)
        _save(WARNS_FILE, warns)

        count = len(warns[guild_id][user_id])

        try:
            await member.send(
                embed=mod_embed(
                    "Warning Received",
                    f"You received a warning in **{interaction.guild.name}**\nReason: {reason}\nTotal warnings: {count}",
                )
            )
        except discord.Forbidden:
            pass

        embed = success_embed("Warning Issued", f"**{member}** has been warned.\nReason: {reason}\nTotal warnings: **{count}**")

        # Auto-actions based on warn count
        if count == 3:
            embed.add_field(name="⚠️ Notice", value="This member now has 3 warnings.", inline=False)
        elif count >= 5:
            embed.add_field(name="🚨 Alert", value="This member has 5+ warnings. Consider a ban.", inline=False)

        await interaction.response.send_message(embed=embed)

    # ── Warnings ──────────────────────────────────────

    @app_commands.command(name="warnings", description="View a member's warnings")
    @app_commands.describe(member="Member to check")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def warnings(self, interaction: discord.Interaction, member: discord.Member):
        warns = _load(WARNS_FILE)
        guild_id = str(interaction.guild.id)
        user_id = str(member.id)

        user_warns = warns.get(guild_id, {}).get(user_id, [])

        if not user_warns:
            return await interaction.response.send_message(
                embed=success_embed("Clean Record", f"**{member}** has no warnings."),
                ephemeral=True,
            )

        embed = mod_embed("Warnings", f"**{member}** has **{len(user_warns)}** warning(s)")
        for i, w in enumerate(user_warns[-10:], 1):  # Show last 10
            mod = self.bot.get_user(w["moderator_id"])
            mod_name = str(mod) if mod else f"ID: {w['moderator_id']}"
            embed.add_field(
                name=f"#{i} — {w['timestamp'][:10]}",
                value=f"Reason: {w['reason']}\nBy: {mod_name}",
                inline=False,
            )

        await interaction.response.send_message(embed=embed)

    # ── Clear Warnings ────────────────────────────────

    @app_commands.command(name="clearwarns", description="Clear all warnings for a member")
    @app_commands.describe(member="Member to clear warnings for")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def clearwarns(self, interaction: discord.Interaction, member: discord.Member):
        warns = _load(WARNS_FILE)
        guild_id = str(interaction.guild.id)
        user_id = str(member.id)

        if guild_id in warns and user_id in warns[guild_id]:
            del warns[guild_id][user_id]
            _save(WARNS_FILE, warns)

        await interaction.response.send_message(
            embed=success_embed("Warnings Cleared", f"All warnings for **{member}** have been cleared.")
        )

    # ── Purge ─────────────────────────────────────────

    @app_commands.command(name="purge", description="Delete messages from a channel")
    @app_commands.describe(amount="Number of messages to delete (1-100)", member="Only delete messages from this member")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def purge(
        self,
        interaction: discord.Interaction,
        amount: int,
        member: Optional[discord.Member] = None,
    ):
        if not 1 <= amount <= 100:
            return await interaction.response.send_message(
                embed=error_embed("Invalid Amount", "Please provide a number between 1 and 100."),
                ephemeral=True,
            )

        await interaction.response.defer(ephemeral=True)

        if member:
            deleted = await interaction.channel.purge(
                limit=amount, check=lambda m: m.author == member
            )
        else:
            deleted = await interaction.channel.purge(limit=amount)

        await interaction.followup.send(
            embed=success_embed("Messages Purged", f"Deleted **{len(deleted)}** message(s)."),
            ephemeral=True,
        )

    # ── Slowmode ──────────────────────────────────────

    @app_commands.command(name="slowmode", description="Set channel slowmode delay")
    @app_commands.describe(seconds="Slowmode delay in seconds (0 to disable)")
    @app_commands.checks.has_permissions(manage_channels=True)
    async def slowmode(self, interaction: discord.Interaction, seconds: int):
        seconds = max(0, min(21600, seconds))
        await interaction.channel.edit(slowmode_delay=seconds)

        if seconds == 0:
            await interaction.response.send_message(
                embed=success_embed("Slowmode Disabled", "Slowmode has been turned off for this channel.")
            )
        else:
            await interaction.response.send_message(
                embed=success_embed("Slowmode Set", f"Slowmode set to **{seconds}** second(s).")
            )

    # ── Background task: check expired mutes ──────────

    @tasks.loop(minutes=1)
    async def check_mutes(self):
        pass  # Discord handles timeout expiry natively, but this is here for extension

    @check_mutes.before_loop
    async def before_check_mutes(self):
        await self.bot.wait_until_ready()

    # ── Error handlers ────────────────────────────────

    @kick.error
    @ban.error
    @unban.error
    @mute.error
    @unmute.error
    @warn.error
    @warnings.error
    @clearwarns.error
    @purge.error
    @slowmode.error
    async def mod_error(self, interaction: discord.Interaction, error):
        if isinstance(error, app_commands.MissingPermissions):
            await interaction.response.send_message(
                embed=error_embed("Missing Permissions", "You don't have permission to use this command."),
                ephemeral=True,
            )
        else:
            await interaction.response.send_message(
                embed=error_embed("Error", f"Something went wrong: {error}"),
                ephemeral=True,
            )


async def setup(bot: commands.Bot):
    await bot.add_cog(Moderation(bot))
