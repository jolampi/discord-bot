import { TextChannel, User } from "discord.js";
import { shuffle } from "lodash";

interface Player {
  id: string;
  username: string;
  state: string;
}

class Diplomacy {
  public readonly maxPlayers: number;
  private readonly channel: TextChannel;
  private readonly players: Map<string, Player>;
  private readonly playersToOrders: Map<string, string>;
  private votesToReveal: string[];

  // TODO: Refactor channel out
  constructor(channel: TextChannel, maxPlayers: number) {
    this.channel = channel;
    this.maxPlayers = maxPlayers;
    this.players = new Map();
    this.playersToOrders = new Map();
    this.votesToReveal = [];
  }

  public getPlayerCount(): number {
    return this.players.size;
  }

  public getCurrentOrders(): number {
    return this.playersToOrders.size;
  }

  public getCurrentVotes(): number {
    return this.votesToReveal.length;
  }

  public addPlayer(user: User, state: string): void {
    const { id, username } = user;
    if (this.players.size >= this.maxPlayers && !this.players.has(id)) {
      return;
    }

    this.players.set(id, { id, username, state });
    this.channel.send(
      `${user} joined as ${state} for a total of ${this.players.size}/${this.maxPlayers} players.`
    );
  }

  public setOrders(user: User, commands: string): boolean {
    if (!this.players.has(user.id)) {
      return false;
    }

    this.playersToOrders.set(user.id, commands);
    return true;
  }

  public voteForReveal(user: User): void {
    const id = user.id;
    if (!this.playersToOrders.has(id) || this.votesToReveal.includes(id)) {
      return;
    }

    this.votesToReveal.push(id);
    const votes = this.votesToReveal.length;
    const requiredVotes = Math.ceil(0.75 * this.maxPlayers);
    if (this.votesToReveal.length < requiredVotes) {
      this.channel.send(`${requiredVotes - votes} more votes required for reveal.`)
    } else {
      this.revealOrders();
    }
  }

  public showStatus(): void {
    this.channel.send(`
${this.getPlayerCount()}/${this.maxPlayers} players
${this.getCurrentOrders()}/${this.maxPlayers} orders given
${this.getCurrentVotes()}/${this.maxPlayers} votes`)
  }

  private revealOrders(): void {
    const orders = Array
      .from(this.playersToOrders.entries())
      .map(([id, commands]) =>
        commands
          ? `\n${this.players.get(id)?.state}: ${commands}\n`
          : "",
      )
    this.channel.send(`Results of this round: ${shuffle(orders).join("")}`);
    this.playersToOrders.clear();
    this.votesToReveal = [];
  }
}

export default Diplomacy
