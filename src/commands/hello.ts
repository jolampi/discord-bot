import { Command } from "./types";

const handler: Command["handler"] = async (message) => {
  message.channel.send(`Hello ${message.author}!`);
};

const command: Command = {
  command: "hello",
  description: "Greet the caller",
  handler,
};

export default command;
