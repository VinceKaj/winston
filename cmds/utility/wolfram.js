const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const mongo = require("../../mongo");
const guildSchema = require("../../schemas/guild-schema");

module.exports = class WolframCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "wolfram",
      group: "utility",
      memberName: "wolfram",
      format: `{query}`,
      description: "search something in Wolfram Alpha",
      aliases: ["wa", "wolf"],
      examples: [
        ".wolfram graph 2y=3x+7",
      ],
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, args) {
    const { channel, author, guild } = message;

    const msg = await channel.send("Loading results from Wolfram Alpha...");

    const output = await fetch(
      `http://api.wolframalpha.com/v1/result?appid=${process.env.WOLFRAM_TOKEN_0}&i=${args}`,
    );

    const embed = new Discord.MessageEmbed()
      .setColor("#E2073C")
      .setAuthor("Results from Wolfram Alpha", "https://cdn.discordapp.com/attachments/773171511943102484/791270738711019540/a.png", `https://www.wolframalpha.com`)
      .setDescription(`[Click here to view your query](https://www.wolframalpha.com/input/?i=${encodeURIComponent(args)})`)
      .setImage(`http://api.wolframalpha.com/v1/simple?appid=${process.env.WOLFRAM_TOKEN_2}&i=${encodeURIComponent(args)}`)
      .setTimestamp()
      .setFooter(`Requested by ${author.tag}`, author.avatarURL());

    channel.send(embed).then(() => { msg.delete() });


    if (channel.type != "dm") {
      await mongo().then(async (mongoose) => {
        try {
          await guildSchema
            .findOneAndUpdate(
              {
                _id: guild.id,
              },
              {
                $inc: {
                  longWolframQueriesTotal: 1, // increases simple queries by 1 (total)
                },
              },
              {
                upsert: true,
              }
            )
            .exec();
        } finally {
          mongoose.connection.close();
        }
      });
    }
  }
};
