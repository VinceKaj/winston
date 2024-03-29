const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class AvatarCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "avatar",
      group: "images",
      memberName: "avatar",
      format: `[@user]`,
      description: "get the avatar of a specific member of the server",
      examples: [
        `.avatar <@${bot.user.id}>`,
        `.avatar <@${process.env.CREATOR}>`,
      ],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { channel, guild, author } = message;
    let member;

    if (args && args.startsWith("<@") && args.endsWith(">")) {
      // is a mention
      let target = args.slice(2, -1);

      if (target.startsWith("!")) target = target.slice(1);

      member = guild.members.cache.get(target); // set user target as ID
    }

    if (member)
        member = member.user;
    else
        member = author;

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("User Avatar")
      .setDescription(`<@${member.id}>'s Discord Avatar`)
      .setImage(member.avatarURL({ format: "png" }))
      .setTimestamp()
      .setFooter(`Requested by ${author.tag}`, author.avatarURL());

    channel.send(embed);
  }
};
