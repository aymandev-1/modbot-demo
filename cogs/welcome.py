import json
import os

import discord
from discord import app_commands
from discord.ext import commands

from utils.helpers import success_embed

CONFIG_FILE = "data/welcome_config.json"


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


def _format_message(template: str, member: discord.Member) -> str:
    """Replace placeholders in welcome/leave messages."""
    return (
        template.replace("{user}", member.mention)
        .replace("{username}", str(member))
        .replace("{server}", member.guild.name)
        .replace("{membercount}", str(member.guild.member_count))
    )


class Welcome(commands.Cog):
    """Welcome and leave messages."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    # ── Welcome channel setup ─────────────────────────

    welcome_group = app_commands.Group(name="welcome", description="Configure welcome messages")

    @welcome_group.command(name="channel", description="Set the welcome message channel")
    @app_commands.describe(channel="Channel for welcome messages")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def set_channel(self, interaction: discord.Interaction, channel: discord.TextChannel):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        if guild_id not in configs:
            configs[guild_id] = {}
        configs[guild_id]["channel_id"] = channel.id
        _save_config(configs)

        await interaction.response.send_message(
            embed=success_embed("Welcome Channel", f"Welcome messages will be sent to {channel.mention}")
        )

    @welcome_group.command(name="message", description="Set the welcome message")
    @app_commands.describe(message="Welcome message. Use {user}, {username}, {server}, {membercount}")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def set_message(self, interaction: discord.Interaction, message: str):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        if guild_id not in configs:
            configs[guild_id] = {}
        configs[guild_id]["welcome_message"] = message
        _save_config(configs)

        preview = _format_message(message, interaction.user)
        embed = success_embed("Welcome Message Set", f"Preview:\n{preview}")
        await interaction.response.send_message(embed=embed)

    @welcome_group.command(name="leave", description="Set the leave message")
    @app_commands.describe(message="Leave message. Use {username}, {server}, {membercount}")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def set_leave(self, interaction: discord.Interaction, message: str):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        if guild_id not in configs:
            configs[guild_id] = {}
        configs[guild_id]["leave_message"] = message
        _save_config(configs)

        preview = _format_message(message, interaction.user)
        embed = success_embed("Leave Message Set", f"Preview:\n{preview}")
        await interaction.response.send_message(embed=embed)

    @welcome_group.command(name="autorole", description="Set a role to give new members")
    @app_commands.describe(role="Role to assign on join")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def set_autorole(self, interaction: discord.Interaction, role: discord.Role):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        if guild_id not in configs:
            configs[guild_id] = {}
        configs[guild_id]["autorole_id"] = role.id
        _save_config(configs)

        await interaction.response.send_message(
            embed=success_embed("Auto-Role Set", f"New members will receive {role.mention}")
        )

    @welcome_group.command(name="test", description="Send a test welcome message")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def test(self, interaction: discord.Interaction):
        configs = _load_config()
        guild_id = str(interaction.guild.id)
        config = configs.get(guild_id, {})

        channel_id = config.get("channel_id")
        if not channel_id:
            return await interaction.response.send_message(
                embed=discord.Embed(
                    title="❌ No Channel Set",
                    description="Use `/welcome channel` first.",
                    colour=0xE74C3C,
                ),
                ephemeral=True,
            )

        channel = interaction.guild.get_channel(channel_id)
        if not channel:
            return await interaction.response.send_message(
                embed=discord.Embed(
                    title="❌ Channel Not Found",
                    description="The configured channel no longer exists.",
                    colour=0xE74C3C,
                ),
                ephemeral=True,
            )

        template = config.get("welcome_message", "Welcome to **{server}**, {user}! You're member #{membercount}.")
        text = _format_message(template, interaction.user)

        embed = discord.Embed(
            title="👋 Welcome!",
            description=text,
            colour=0x2ECC71,
        )
        embed.set_thumbnail(url=interaction.user.display_avatar.url)
        await channel.send(embed=embed)

        await interaction.response.send_message(
            embed=success_embed("Test Sent", f"Check {channel.mention}"),
            ephemeral=True,
        )

    # ── Event listeners ───────────────────────────────

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        configs = _load_config()
        guild_id = str(member.guild.id)
        config = configs.get(guild_id, {})

        # Auto-role
        autorole_id = config.get("autorole_id")
        if autorole_id:
            role = member.guild.get_role(autorole_id)
            if role:
                try:
                    await member.add_roles(role, reason="Auto-role on join")
                except discord.Forbidden:
                    pass

        # Welcome message
        channel_id = config.get("channel_id")
        if not channel_id:
            return

        channel = member.guild.get_channel(channel_id)
        if not channel:
            return

        template = config.get("welcome_message", "Welcome to **{server}**, {user}! You're member #{membercount}.")
        text = _format_message(template, member)

        embed = discord.Embed(title="👋 Welcome!", description=text, colour=0x2ECC71)
        embed.set_thumbnail(url=member.display_avatar.url)
        await channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member):
        configs = _load_config()
        guild_id = str(member.guild.id)
        config = configs.get(guild_id, {})

        channel_id = config.get("channel_id")
        if not channel_id:
            return

        channel = member.guild.get_channel(channel_id)
        if not channel:
            return

        template = config.get("leave_message")
        if not template:
            return

        text = _format_message(template, member)
        embed = discord.Embed(title="👋 Goodbye", description=text, colour=0xE74C3C)
        embed.set_thumbnail(url=member.display_avatar.url)
        await channel.send(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(Welcome(bot))
