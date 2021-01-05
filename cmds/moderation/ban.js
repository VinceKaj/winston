const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class BanCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "ban",
      group: "moderation",
      memberName: "ban",
      aliases: ["🔨"],
      description: "ban a member from the server",
      format: `{@user} [reason]`,
      examples: [
        `.ban <@${process.env.CREATOR}> for breaking the rules`,
      ],
      argsType: "multiple",
      clientPermissions: ["BAN_MEMBERS"],
      userPermissions: ["BAN_MEMBERS"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { guild, channel, author } = message;
    let target, member;

    /* Get target mention */
    if (args[0] && args[0].startsWith("<@") && args[0].endsWith(">")) {
      // is a mention
      target = args[0].slice(2, -1);

      if (target.startsWith("!")) target = target.slice(1);
      member = guild.members.cache.get(target);
    }

    if (!member) {
      channel.send("Please specify a member to ban.");
      return;
    }

    if (member.bannable) {

      let reason = "None";
      if (args[1]) reason = args.slice(1, args.length).join(" ");

      const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle('Server Ban')
        .addFields(
          { name: 'Banned', value: `${member.user.tag}`},
          { name: 'Reason', value: reason },
          { name: "Moderator", value: `<@${author.id}>` }
        )
        .setTimestamp()
        .setFooter(`Requested by ${author.tag}`, author.avatarURL());

      channel.send(embed);
      member.ban({ reason: reason });

    } else {
      message.channel.send("I'm not high enough in the hierarchy to do that.");
    }
  }
};
