import { Client } from "discord.js";
import * as dotenv from "dotenv";

import { diplomacy, Command, hello, help, random } from "./commands";

dotenv.config();
const PREFIX = process.env.NODE_ENV === "production" ? "!" : "d!";
const PREFIX_LENGTH = PREFIX.length;

const commands = new Map<string, Command>();
const addCommand = (c: Command) => commands.set(c.command, c);

addCommand(diplomacy);
addCommand(hello);
addCommand(
  help({ getCommands: () => Array.from(commands.values()), prefix: PREFIX })
);
addCommand(random);

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
  // client.user?.setActivity("Doubling money", { type: "PLAYING" });
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
