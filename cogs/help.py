import discord
from discord import app_commands
from discord.ext import commands


class Help(commands.Cog):
    """Custom help command."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="help", description="Show all available commands")
    async def help(self, interaction: discord.Interaction):
        embed = discord.Embed(
            title="📖 ModBot Commands",
            description="A full-featured moderation bot for your server.",
            colour=0x3498DB,
        )

        embed.add_field(
            name="🔨 Moderation",
            value=(
                "`/kick` — Kick a member\n"
                "`/ban` — Ban a member\n"
                "`/unban` — Unban a user by ID\n"
                "`/mute` — Timeout a member\n"
                "`/unmute` — Remove timeout\n"
                "`/warn` — Issue a warning\n"
                "`/warnings` — View warnings\n"
                "`/clearwarns` — Clear all warnings\n"
                "`/purge` — Delete messages\n"
                "`/slowmode` — Set slowmode delay"
            ),
            inline=False,
        )

        embed.add_field(
            name="🛡️ Auto-Mod",
            value=(
                "`/automod toggle` — Enable/disable auto-mod\n"
                "`/automod antispam` — Toggle spam filter\n"
                "`/automod antilinks` — Toggle link filter\n"
                "`/automod addword` — Add blocked word\n"
                "`/automod removeword` — Remove blocked word\n"
                "`/automod status` — View settings"
            ),
            inline=False,
        )

        embed.add_field(
            name="👋 Welcome",
            value=(
                "`/welcome channel` — Set welcome channel\n"
                "`/welcome message` — Set welcome message\n"
                "`/welcome leave` — Set leave message\n"
                "`/welcome autorole` — Auto-assign role\n"
                "`/welcome test` — Send test message"
            ),
            inline=False,
        )

        embed.add_field(
            name="📋 Logging",
            value="`/setlogs` — Set the log channel",
            inline=False,
        )

        embed.add_field(
            name="🔧 Utility",
            value=(
                "`/ping` — Check latency\n"
                "`/uptime` — Bot uptime\n"
                "`/serverinfo` — Server info\n"
                "`/userinfo` — User info\n"
                "`/avatar` — User avatar"
            ),
            inline=False,
        )

        embed.set_footer(text="ModBot by aymandev • github.com/aymandev/modbot")
        await interaction.response.send_message(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(Help(bot))
