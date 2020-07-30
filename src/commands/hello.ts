import { Command, CommandHandler } from "./types";

const handler: CommandHandler = async (message) => {
  message.channel.send(`Hello ${message.author}!`);
};

const usage = `hello
Everybody needs someone to talk to.
`;

const command: Command = {
  command: "hello",
  description: "Greet the caller",
  handler,
  usage,
};

export default command;
