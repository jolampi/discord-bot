import { Message } from "discord.js";

interface Command {
  command: string;
  description: string;
  handler: CommandHandler;
  usage: string;
}

interface CommandHandler {
  (message: Message, args: string[]): Promise<void>;
}

interface CommandProvider<T> {
  (t: T): Command;
}

export { Command, CommandHandler, CommandProvider };
