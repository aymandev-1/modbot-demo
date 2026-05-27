import os
import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("BOT_TOKEN")
PREFIX = os.getenv("PREFIX", "!")


class ModBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        intents.presences = True

        super().__init__(
            command_prefix=PREFIX,
            intents=intents,
            help_command=None,
            activity=discord.Activity(
                type=discord.ActivityType.watching, name="over the server"
            ),
        )

    async def setup_hook(self):
        cog_list = [
            "cogs.moderation",
            "cogs.automod",
            "cogs.logging",
            "cogs.welcome",
            "cogs.utility",
            "cogs.help",
        ]
        for cog in cog_list:
            try:
                await self.load_extension(cog)
                print(f"  ✓ Loaded {cog}")
            except Exception as e:
                print(f"  ✗ Failed to load {cog}: {e}")

        await self.tree.sync()
        print(f"  ✓ Synced slash commands")

    async def on_ready(self):
        print(f"\n{'='*40}")
        print(f"  ModBot is online!")
        print(f"  Logged in as {self.user} ({self.user.id})")
        print(f"  Servers: {len(self.guilds)}")
        print(f"  Prefix: {PREFIX}")
        print(f"{'='*40}\n")


if __name__ == "__main__":
    if not TOKEN:
        print("ERROR: No bot token found. Create a .env file with BOT_TOKEN=your_token")
        exit(1)

    bot = ModBot()
    bot.run(TOKEN)
