const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

function Decrypt(msg) {
  const galactic = '';
  const alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "ᔑ", "ʖ", "ᓵ", "↸", "ᒷ", "⎓", "⊣", "⍑", "⋮", "ꖌ", "ꖎ", "ᒲ", "リ", "𝙹", "!¡", "ᑑ", "∷", "ᓭ", "ℸ", "⚍", "⍊", "∴", "̇/", "||", "⨅"];
}

module.exports = class GalacticCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "SGA",
      group: "text",
      memberName: "sga",
      description: "encode and decode messages with the standard galactic alphabet",
      aliases: ['galactic', 'ga'],
      format: `{message in galactic or latin}`,
      examples: [
        ".sga decode 01101000 01100101 01101100 01101100 01101111",
        ".sga encode hello world!",
      ],
    });
  }

  async run(message, args) {
    const { channel, author } = message;

    const msg = await channel.send("Loading result...");

    if (args) {
      const result = Decrypt(args.toLowerCase());

      msg.edit(`**Translated:\n> ${result}**`);
      return;
    }
    msg.edit("I cannot translate empty messages.");
  }
};
