import VoiceConnectionManager from "../managers/VoiceConnectionManager";

import { CommandHandler, CommandProvider } from "./types";

const usage = `stop
Stops current voice activity.
`;

interface ProviderArgs {
  voiceConnectionManager: VoiceConnectionManager;
}

const provider: CommandProvider<ProviderArgs> = ({
  voiceConnectionManager,
}) => {
  const handler: CommandHandler = async () => {
    voiceConnectionManager.stop();
  };

  return {
    command: "stop",
    description: "Stops current voice activity.",
    handler,
    usage,
  };
};

export default provider;
