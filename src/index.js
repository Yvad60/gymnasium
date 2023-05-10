import { Client, Collection, IntentsBitField } from "discord.js";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessages,
  ],
});

client.commands = new Collection();

client.on("ready", (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("messageCreate", (message) => {
  console.log(message);
  if (!message.author.bot) message.reply("Hello there how are ibrahim?");
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);
});

client.login("MTEwNTIyNDY2NDYwMDU1MTU3NA.GTkPh2.tLwkoNrIbg67IB5Krb-sN0PjtzpETl-wu4B1BA");
