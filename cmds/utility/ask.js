const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

const calculator = require("../../calculator");

const mongo = require("../../mongo");
const guildSchema = require("../../schemas/guild-schema");

const options = [
  "olfram",
  "wolf",
  "fram",
  "alpha"
];

module.exports = class AskCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "ask",
      group: "utility",
      memberName: "ask",
      format: `{query}`,
      description: "ask Winston anything",
      aliases: ["a"],
      examples: [
        ".ask what is the height of mount everest",
        ".ask what is the meaning of life",
        ".ask are you alive?"
      ],
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, args) {
    const { channel, author, guild } = message;

    if (!args) {
      channel.send("Sorry, I don't understand. (Invalid query)");
      return;
    }

    const msg = await channel.send("Thinking...");
    
    let output, result = calculator.calculate(args);

    if (result == "NaN") {
      output = await fetch(`http://api.wolframalpha.com/v1/result?appid=${process.env.WOLFRAM_TOKEN_1}&i=${args}`,
      { method: "Get", } );
      result = await output.text();
    }

    if (result == "No short answer available" || result == "Wolfram|Alpha did not understand your input")
      result = "Sorry, I don't know how to answer that. Try running `wolfram` command.";
    
    if (result == "I was created by Stephen Wolfram and his team") {
      if (new RegExp(options.join("|")).test(args.toLowerCase()))
        result = `Wolfram Alpha was created by Stephen Wolfram and his team`;
      else
        result = `I was created by VinceKaj (<@${process.env.CREATOR}>). More information available on my official server: https://discord.gg/P8xBnNdvSX`;
    }
    
    msg.edit(result);

    if (output && channel.type != "dm") { // if Wolfram was used
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
