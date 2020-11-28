// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import VoiceConnectionManager from "../managers/VoiceConnectionManager";

import { CommandHandler, CommandProvider } from "./types";

const usage = `leave
Leaves active voice channel.
`;

interface ProviderArgs {
  voiceConnectionManager: VoiceConnectionManager;
}

const provider: CommandProvider<ProviderArgs> = ({
  voiceConnectionManager,
}) => {
  const handler: CommandHandler = async () => {
    voiceConnectionManager.leaveChannel();
  };

  return {
    command: "leave",
    description: "Leave active voice channel",
    handler,
    usage,
  };
};

export default provider;
