const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const calculator = require("../../calculator");

const mongo = require("../../mongo");
const guildSchema = require("../../schemas/guild-schema");

module.exports = class AskCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "ask",
      group: "utility",
      memberName: "ask",
      description: "ask Winston and he will try to answer",
      aliases: ["a"],
      examples: [
        "ask {query}",
        ".ask height of mount everest",
        ".ask meaning of life",
      ],
    });
  }

  async run(message, args) {
    const { channel, author, guild } = message;

    if (!args) {
      channel.send("Sorry, I don't understand. (Invalid query)");
      return;
    }

    
    let output, result = calculator.calculate(args);

    if (result == "NaN") {
      output = await fetch(`http://api.wolframalpha.com/v1/result?appid=${process.env.WOLFRAM_TOKEN_0}&i=${args}`,
      { method: "Get", } );
      result = await output.text();
    }

    message.reply(result);

    if (output) { // if Wolfram was used
      /** SAVE QUERY USE ***/
      await mongo().then(async (mongoose) => {
        try {
          await guildSchema.findOneAndUpdate(
              {
                _id: guild.id,
              },
              {
                $inc: {
                  simpleWolframQueriesTotal: 1, // increases simple queries by 1 (total)
                },

              },
              {
                upsert: true,
              }
            ).exec();
        } finally {
          mongoose.connection.close();
        }
      });
    }
  }
};
