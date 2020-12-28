const { Command, Client } = require("discord.js-commando");
const Discord = require("discord.js");
const ud = require("urban-dictionary");

module.exports = class UrbanCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "urban",
      group: "text",
      memberName: "urban",
      aliases: ["urban-dictionary", "urban-definition"],
      format: `{word}`,
      description: "finds a word in the urban dictionary",
      examples: [".define poggers", ".define simp"],
      throttling: {
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(message, args) {
    const { channel, author } = message;
    args = args.toLowerCase();

    if (args) {
      const msg = await channel.send("Loading urban definition...");

      ud.term(args, (error, entries) => {
        if (error) {
          msg.edit(`Urban dictionary cannot define '${args}'`);
        } else {
          let embed = new Discord.MessageEmbed()
          .setColor("#f49907")
          .setTitle(`Urban dictionary: ${args}`)
          .setDescription(`For more information about ${args}, [click here](https://www.urbandictionary.com/define.php?term=${args})`)
          .setURL(`https://www.urbandictionary.com/define.php?term=${args}`)
          .setTimestamp()
          .setFooter(`Requested by ${author.tag}`, author.avatarURL());

          for (const i in entries) {
            let { word, definition, example } = entries[i];


            definition = definition.replace(/[[\]]/g,'') // removes []
            example = example.replace(/[[\]]/g,'') // removes []
            word = word.replace(/[[\]]/g,''); // removes []
            
            embed.addField(`${i*1+1}. ${word}`, `__Definition:__ ${definition}` + '\n' + `__Examples:__ \n${example}`);

            if (i == 1) break; // no more than 2 examples
          }

          channel.send(embed).then(() => { msg.delete() });
        }
      });
    } else {
      channel.send("Please enter a word to define.");
    }
  }
};
