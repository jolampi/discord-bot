import { Client } from "discord.js";
import * as dotenv from "dotenv";

import { Command, hello, help, leave, play, random, stop } from "./commands";
import VoiceConnectionManager from "./managers/VoiceConnectionManager";

dotenv.config();
const PREFIX = process.env.NODE_ENV === "production" ? "!" : "d!";
const PREFIX_LENGTH = PREFIX.length;

const client = new Client();
const voiceConnectionManager = new VoiceConnectionManager(client);

const commands = new Map<string, Command>();
const addCommand = (c: Command) => commands.set(c.command, c);
addCommand(hello);
addCommand(
  help({ getCommands: () => Array.from(commands.values()), prefix: PREFIX })
);
addCommand(leave({ voiceConnectionManager }));
addCommand(play({ voiceConnectionManager }));
addCommand(random);
addCommand(stop({ voiceConnectionManager }));

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) {
    return;
  }

  const [command, ...args] = message.content
    .substring(PREFIX_LENGTH)
    .split(/\s+/);
  // console.log(command, args);
  commands.get(command)?.handler(message, args);
});

client.login(process.env.DISCORD_TOKEN);
