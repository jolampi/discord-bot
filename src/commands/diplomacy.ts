import { TextChannel, DMChannel } from "discord.js";

import Diplomacy from "../managers/Diplomacy";

import { Command, CommandHandler } from "./types";

const THUMBS_UP = "👍";

let channelId: string | undefined;
let diplomacy: Diplomacy | undefined;

const usage = `diplomacy [SUBCOMMAND] [...]

COMMAND:
  start [n]     Starts game with n max players on current channel.
  join [state]  Join the current game as state.
  orders [any]  Give orders for the round (only available via PM).
  reveal        Vote to reveal orders.
  end           Ends game.
`

const handler: CommandHandler = async (message, messageArgs) => {
  const { channel, author } = message;
  if (messageArgs.length === 0) {
    return;
  }
  const [subcommand, ...rest] = messageArgs;

  if (diplomacy && subcommand === "orders" && channel instanceof DMChannel) {
    if (diplomacy.setOrders(author, rest.join(" "))) {
      message.react(THUMBS_UP);
    }
    return;
  } else if (!(channel instanceof TextChannel)) {
    return;
  }
  
  if (!diplomacy && subcommand === "start") {
    const players = parseInt(rest[0]);
    if (isNaN(players)) {
      return;
    }
    diplomacy = new Diplomacy(channel, players);
    channelId = channel.id;
    channel.send(`Hosting Diplomacy on this channel for ${players} players.`);
    return;
  }

  if (channel.id !== channelId) {
    return;
  }

  switch(subcommand) {
    case "join": {
      const state: string | undefined = rest[0];
      if (!state) {
        return;
      }
      diplomacy?.addPlayer(author, state);
      break;
    }
    case "reveal":
      diplomacy?.voteForReveal(author);
      break;
    case "status":
      diplomacy?.showStatus();
      break;
    case "end":
      diplomacy = undefined;
      channelId = undefined;
      break;
  }
}

const command: Command = {
  command: "diplomacy",
  description: "Host diplomacy orders",
  handler,
  usage,
}

export default command;
