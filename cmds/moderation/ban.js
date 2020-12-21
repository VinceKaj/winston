const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class BanCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "ban",
      group: "moderation",
      memberName: "ban",
      description: "ban a member from the server",
      examples: ["ban {user} [reason]", `.ban <@${process.env.CREATOR}> for breaking the rules`],
      argsType: "multiple",
      clientPermissions: ["BAN_MEMBERS"],
      userPermissions: ["BAN_MEMBERS"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    let target;

    const { guild } = message;

    /* Get target mention */
    if (args[0] && args[0].startsWith("<@") && args[0].endsWith(">")) {
      // is a mention
      target = args[0].slice(2, -1);

      if (target.startsWith("!")) target = target.slice(1);
    }

    const member = guild.members.cache.get(target); // set user target as ID

    if (!member) {
      message.channel.send("Please specify a member to ban.");
      return;
    }

    if (member.bannable) {
      message.channel.send(
        `**${member.user.tag}** has been banned from the server by **${message.author.tag}**`
      );
      member.ban();
    } else {
      message.channel.send("I'm not high enough in the hierarchy to do that.");
    }
  }
};
