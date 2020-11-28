import ytdl from "ytdl-core";

import VoiceConnectionManager from "../managers/VoiceConnectionManager";

import { CommandHandler, CommandProvider } from "./types";

const usage = `play [URL]
Plays song from youtube link.

URL: Youtube url
`;

interface ProviderArgs {
  voiceConnectionManager: VoiceConnectionManager;
}

const provider: CommandProvider<ProviderArgs> = ({
  voiceConnectionManager,
}) => {
  const handler: CommandHandler = async (message, args) => {
    if (args.length === 0) {
      return;
    }

    const channel = message.member?.voice.channel;
    if (!channel) {
      message.reply("You must be on a voice channel to use this command.");
      return;
    }

    if (args[0].startsWith("https://www.youtube.com/watch?v=")) {
      const getDispatcher = () =>
        ytdl(args[0].split("&")[0], {
          quality: "highestaudio",
          highWaterMark: 1 << 25,
        });
      const title = (await ytdl.getBasicInfo(args[0])).videoDetails.title;

      if (!voiceConnectionManager.isOnChannel) {
        await voiceConnectionManager.joinChannel(channel);
      }

      console.log("Adding", title, "to queue");
      voiceConnectionManager.addDispatcherToQueue({ getDispatcher, title });
    }
  };

  return {
    command: "play",
    description: "Plays stuff on voice channel",
    handler,
    usage,
  };
};

export default provider;
