import { Client, Events, GatewayIntentBits, Message } from "discord.js";
import 'dotenv/config';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log("Bot conectado! \nCliente: " + c.user.tag + "\n" + now);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "ping") {
    await interaction.reply("El BOT Esta activo actualmente");
  }
});

client.login(process.env.TOKEN);