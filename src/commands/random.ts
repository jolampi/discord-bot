import { Command } from "./types";

const handler: Command["handler"] = async (message, args) => {
  const result = new Map<string, string[]>();
  const filtered: string[] = [];

  const addToResults = (key: string, value: string) => {
    result.set(key, (result.get(key) || []).concat(value));
  };

  const throwDice = (times: number, sides: number) => {
    const results: number[] = [];
    for (let i = 0; i < times; i++) {
      results.push(Math.floor(1 + Math.random() * sides));
    }
    return results;
  }

  args.forEach(arg => {
    let match: RegExpMatchArray | null;
    if (match = arg.match(/(\d+)d(\d+)/i)) {
      const subresult = throwDice(parseInt(match[1]), parseInt(match[2]));
      if (subresult.length > 0) {
        addToResults(arg, subresult.join('-'))
      }
    } else if (match = arg.match(/(\d+)-(\d+)/)) {
      const min = parseInt(match[1]);
      const max = parseInt(match[2]);
      addToResults(arg, `${min + Math.floor(Math.random() * (max - min + 1))}`);
    } else if (match = arg.match(/coin/i)) {
      addToResults('coins', Math.random() < 0.5 ? 'heads' : 'tails');
    } else {
      filtered.push(arg);
    }
  });

  if (filtered.length > 0) {
    const item = filtered[Math.floor(Math.random() * filtered.length)]
    addToResults(`[${filtered.join(',')}]`, item)
  };

  switch(result.size) {
    case 0:
      message.reply(`${Math.random()}`);
      break;
    case 1:
      message.reply(Array.from(result.values())[0]);
      break;
    default:
      message.reply(
        Array
          .from(result.keys())
          .map(key => `\n${key}: ${result.get(key)?.join(', ')}`)
          .join(''),
      );
  };
};

const command: Command = {
  command: "random",
  description: "Get random number, coinflip or item",
  handler,
};

export default command;
