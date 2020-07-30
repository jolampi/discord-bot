import { Client } from "discord.js";
import * as dotenv from "dotenv";

import * as command from "./commands";
import { Command } from "./commands";

dotenv.config();
const PREFIX = process.env.NODE_ENV === "production" ? "!" : "d!";
const PREFIX_LENGTH = PREFIX.length;

const helpUsage = `help [COMMAND]

COMMAND:
  (void)  Shows list of avaiable commands.
  (cmd)   Describes how to use given command.
`;

const help: command.Command = {
  command: "help",
  description: "Shows this menu",
  handler: async (message, args) => {
    if (args.length === 0) {
      const mapped = Array.from(cmds.entries()).map(([k, v]) => `${k} - ${v.description}`);
      const mes = `Available commands:\n${mapped.join("\n")}`;
      message.channel.send("```" + mes + "```");
    } else {
      const command = cmds.get(args[0])
      if (command) {
        message.channel.send("```" + command.usage + "```");
      } else {
        message.reply(`Use ${PREFIX}help help to get help with using help!`);
      }
    }
  },
  usage: helpUsage,
}

const cmds = new Map<string, Command>([ ["help", help] ]);
Object.values(command).forEach(c => {
  cmds.set(c.command, c);
});

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
  // client.user?.setActivity("Doubling money", { type: "PLAYING" });
});

client.on("message", (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) {
    return;
  };

  const [command, ...args] = message.content.substring(PREFIX_LENGTH).split(/\s+/);
  console.log(command, args);
  cmds.get(command)?.handler(message, args);
});

client.login(process.env.DISCORD_TOKEN);
