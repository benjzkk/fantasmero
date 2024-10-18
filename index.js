const {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    Client,
    Collection,
    ComponentType,
    ContextMenuCommandBuilder,
    EmbedBuilder,
    Events,
    GatewayIntentBits,
    InteractionType,
    MessageFlagsBitField,
    ModalBuilder,
    Partials,
    PermissionsBitField,
    StringSelectMenuBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const client = new Client({
  intents: [
      GatewayIntentBits.AutoModerationConfiguration,
      GatewayIntentBits.AutoModerationExecution,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent
  ],
  partials: [
      Partials.Channel,
      Partials.GuildMember,
      Partials.GuildScheduledEvent,
      Partials.Message,
      Partials.Reaction,
      Partials.ThreadMember,
      Partials.User
  ],
  shards: "auto"
});

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

//

const config = require('./src/config.js');

const { readdirSync } = require("node:fs");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

let token = config.token;

client.commandAliases = new Collection();
client.commands = new Collection();
client.slashCommands = new Collection();
client.slashDatas = [];

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

function log(message) {
  console.log(`[${moment().tz('America/Santiago').format('DD-MM-YY HH:mm:ss')}] ${message}`);
};
client.log = log

readdirSync("./src/commands/prefix").forEach(async (folder) => {
  readdirSync(`./src/commands/prefix/${folder}`).forEach(async (file) => {
    const command = await require(`./src/commands/prefix/${folder}/${file}`);
    if (command) {
      client.commands.set(command.name, command);
      if (command.aliases && Array.isArray(command.aliases)) {
        command.aliases.forEach((alias) => {
          client.commandAliases.set(alias, command.name);
        });
      }
    }
  })
});

const slashcommands = [];
readdirSync("./src/commands/slash").forEach(async (folder) => {
  readdirSync(`./src/commands/slash/${folder}`).forEach(async (file) => {
    const command = await require(`./src/commands/slash/${folder}/${file}`);
    client.slashDatas.push(command.data.toJSON());
    client.slashCommands.set(command.data.name, command);
  })
});

readdirSync("./src/events").forEach(async (file) => {
  const event = await require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

process.on("unhandledRejection", (e) => {
  console.log(e);
});
process.on("uncaughtException", (e) => {
  console.log(e);
});
process.on("uncaughtExceptionMonitor", (e) => {
  console.log(e);
});

client.login(token)
.then(() => {
  console.log('Token Ready');
})
.catch((error) => {
  console.error(error);
});

module.exports = client;
