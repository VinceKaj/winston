const { Command, Client } = require("discord.js-commando");
const Discord = require("discord.js");
const Owlbot = require("owlbot-js");

module.exports = class DefineCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "define",
      group: "text",
      memberName: "define",
      aliases: ["dictionary", "definition"],
      format: `{word}`,
      description: "defines a word",
      examples: [".define example", ".define antidisestablishmentarianism"],
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, args) {
    const { channel, author } = message;

    if (args) {
      const msg = await channel.send("Loading definition...");

      const OwlClient = Owlbot(process.env.OWLBOT_TOKEN);
      OwlClient.define(args).then(function(result) {
        const { word, pronunciation } = result;

        let embed = new Discord.MessageEmbed()
          .setColor("#002147")
          .setTitle(`Oxford dictionary: ${word} (pronounced: ${pronunciation})`)
          .setDescription(`For more information about ${word}, [click here](https://www.oxfordlearnersdictionaries.com/definition/english/${word})`)
          .setURL(`https://www.oxfordlearnersdictionaries.com/definition/english/${word}`)
          .setTimestamp()
          .setFooter(`Requested by ${author.tag}`, author.avatarURL());
        
        for (const i in result.definitions) {
          let { type, definition, example } = result.definitions[i];
          if (!example) example = "(No example given)";

          example = example.replace(/<b>/g, "**");
          example = example.replace(/<\/b>/g, "**");
          example = example.replace(/<i>/g, "*");
          example = example.replace(/<\/i>/g, "*");

          embed.addField(`**${i * 1 + 1}. ${word}** (${type})`, `__Definition:__ ${definition}` + '\n' + `__Example:__ ${example}`);
          
          if (i == 4) break; // no more than 5 definitions
        }

        channel.send(embed).then(() => { msg.delete() });
      }).catch((error) => {
        msg.edit(`I cannot define '${args}'`);
      });

    } else {
      channel.send("Please enter a word to define.");
    }
  }
};
