import * as _ from "lodash";
import ytdl from "ytdl-core";

import VoiceConnectionManager, {
  QueueEntry,
} from "../managers/VoiceConnectionManager";

import { CommandHandler, CommandProvider } from "./types";

const DOTA_SOUND_BASE_URL =
  "https://static.wikia.nocookie.net/dota2_gamepedia/images/";
const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

const usage = `play [URL]
Plays song from youtube link.

URL: Youtube or Dota wiki url
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

    const addToQueue = async (entry: QueueEntry): Promise<void> => {
      if (!voiceConnectionManager.isOnChannel) {
        await voiceConnectionManager.joinChannel(channel);
      }

      voiceConnectionManager.addDispatcherToQueue(entry);
    };

    for (const arg of args) {
      if (arg.startsWith(YOUTUBE_BASE_URL)) {
        const getDispatcher = () =>
          ytdl(args[0].split("&")[0], {
            quality: "highestaudio",
            highWaterMark: 1 << 25,
          });
        const title = (await ytdl.getBasicInfo(args[0])).videoDetails.title;
        addToQueue({ getDispatcher, title });
      } else if (arg.startsWith(DOTA_SOUND_BASE_URL)) {
        const getDispatcher = () => arg;
        const title = arg.split("?")[0].split("/")[7] ?? "???";
        addToQueue({ getDispatcher, title });
      }
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
