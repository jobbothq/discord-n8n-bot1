require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();

  if (content.startsWith("/add")) {
    try {
      await axios.post(N8N_WEBHOOK_URL, {
        message: content,
        user: message.author.username
      });
      await message.reply("✅ Task sent to Joblytics scheduler!");
    } catch (error) {
      console.error("❌ Error posting to n8n:", error.message);
      await message.reply("⚠️ Failed to send task to scheduler.");
    }
  }
});

client.login(BOT_TOKEN);
