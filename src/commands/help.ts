import { Command, CommandHandler, CommandProvider } from "./types";

const USAGE = `help [COMMAND]

COMMAND:
  (void)  Shows list of avaiable commands.
  (cmd)   Describes how to use given command.
`;

interface ProviderArgs {
  getCommands: () => Command[];
  prefix: string;
}

const provider: CommandProvider<ProviderArgs> = ({ getCommands, prefix }) => {
  const handler: CommandHandler = async (message, args) => {
    const commands = getCommands();

    if (args.length === 0) {
      const mapped = commands.map((c) => `${c.command} - ${c.description}`);
      const msg = `Available commands:\n${mapped.join("\n")}`;
      message.channel.send("```" + msg + "```");
    } else {
      const command = commands.find((c) => c.command === args[0]);
      if (command) {
        message.channel.send("```" + command.usage + "```");
      } else {
        message.reply(`Use ${prefix}help help to get help with using help!`);
      }
    }
  };

  return {
    command: "help",
    description: "Shows this menu",
    handler,
    usage: USAGE,
  };
};

export default provider;
