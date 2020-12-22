const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class KickCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "kick",
      group: "moderation",
      memberName: "kick",
      description: "Kick a member from the server",
      format: `{@user} [reason]`,
      examples: [
        `.kick <@${process.env.CREATOR}> for being naughty`,
      ],
      argsType: "multiple",
      clientPermissions: ["KICK_MEMBERS"],
      userPermissions: ["KICK_MEMBERS"],
      guildOnly: true,
    });
  }

  async run(message, args) {

    const { author, channel, guild } = message;
    let target;

    /* Get target mention */
    if (args[0] && args[0].startsWith('<@') && args[0].endsWith('>')) {// is a mention
        target = args[0].slice(2, -1);

        if (target.startsWith('!'))
            target = target.slice(1);
    }

    let reason = "None";
    if (args[1])
      reason = args.slice(1, args.legnth).join(" ");

    const member = guild.members.cache.get(target); // set user target as ID

    if (!member) {
        channel.send("Please specify a member to kick.");
        return;
    }

    if (member.kickable) {

        const embed = new Discord.MessageEmbed()
          .setColor("#0000ff")
          .setTitle("Server Kick")
          .addFields(
            {
              name: "Kicked",
              value: `${member.user.tag}`,
            },
            { name: "Reason", value: reason },
            { name: "Moderator", value: `<@${author.id}>` }
          )
          .setTimestamp()
          .setFooter(`Requested by ${author.tag}`, author.avatarURL());

        channel.send(embed);
        member.kick(reason);
    }
    else {
        channel.send("I'm not high enough in the hierarchy to do that.");
    }
  }
};
