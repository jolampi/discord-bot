import { Message } from "discord.js";

interface Command {
  command: string;
  description: string;
  handler: (message: Message, args: string[]) => Promise<void>;
}

export {
  Command,
};
