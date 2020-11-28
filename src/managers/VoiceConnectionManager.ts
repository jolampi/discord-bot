import {
  Client,
  StreamDispatcher,
  VoiceChannel,
  VoiceConnection,
} from "discord.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import internal from "stream";

interface QueueEntry {
  getDispatcher: () => internal.Readable;
  title: string;
}

class VoiceConnectionManager {
  private readonly client: Client;
  private connection: VoiceConnection | undefined;
  private dispatcher: StreamDispatcher | undefined;
  private queue: Array<QueueEntry>;

  constructor(client: Client) {
    this.client = client;
    this.queue = [];
  }

  get isOnChannel(): boolean {
    return !!this.connection;
  }

  public async joinChannel(channel: VoiceChannel): Promise<boolean> {
    if (this.connection) {
      return false;
    }

    if (!channel.joinable) {
      return false;
    }

    try {
      this.connection = await channel.join();
      console.log("Joined channel", channel.name);
    } catch (e) {
      return false;
    }

    return true;
  }

  public leaveChannel(): void {
    this.stop();
    this.connection?.channel.leave();
    this.connection = undefined;
  }

  public start(): void {
    if (this.connection) {
      if (this.dispatcher && this.dispatcher.paused) {
        this.dispatcher.resume();
      }
    }
  }

  public stop(): void {
    this.dispatcher?.end();
    this.dispatcher?.destroy();
    this.dispatcher = undefined;
    this.client.user?.setActivity(undefined);
  }

  public addDispatcherToQueue(dispatcher: QueueEntry): void {
    if (!this.connection) {
      return;
    }

    const position = this.queue.push(dispatcher);
    console.log(`Added "${dispatcher.title} to queue position ${position}"`);
    if (!this.dispatcher) {
      this.startNextDispatcher();
    }
  }

  private startNextDispatcher(): void {
    this.stop();

    if (!this.connection) {
      console.log("No connection when trying to start next dispatch.");
      return;
    }

    const next = this.queue.shift();
    if (!next) {
      console.log("The queue was empty");
      this.leaveChannel();
      return;
    }

    console.log("Starting to dispatch", next?.title);
    this.dispatcher = this.connection.play(next.getDispatcher());
    this.client.user?.setActivity(next.title, { type: "LISTENING" });
    this.dispatcher.on("error", (err) => {
      console.log(err);
      this.startNextDispatcher();
    });
    this.dispatcher.on("finish", () => {
      this.startNextDispatcher();
    });
  }

  // private getNextDispatch()
}

export default VoiceConnectionManager;
