const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class UnmuteCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "unmute",
      group: "moderation",
      memberName: "unmute",
      description: "Unmute a user from all text channels",
      format: `{@user}`,
      examples: [`.unmute <@${process.env.CREATOR}>`],
      argsType: "multiple",
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { author, channel, content, guild } = message;

    if (!author.hasPermission("MANAGE_ROLES")) {
      channel.send(
        'The `mute` command requires you to have the "Manage roles" permission.'
      );
      return;
    }

    let target, member;
    if (args[0] && args[0].startsWith("<@") && args[0].endsWith(">")) {
      // if is a mention
      target = args[0].slice(2, -1);

      if (target.startsWith("!")) target = target.slice(1);
      member = guild.members.cache.get(target)
    }

    if (!member) {
      // if a member was not mentioned; return
      channel.send("Please specify a member to unmute.");
      return;
    }
    
    /* MUTE ROLE */
    let mutedRole = guild.roles.cache.find((role) => role.name === "Muted");

    /*** CREATE MUTE ROLE ***/
    if (!mutedRole) {
      await guild.roles.create({
        data: { name: "Muted", color: "GREY" },
        reason:
          "This role will be used to mute people with mute/unmute commands.",
      });

      mutedRole = message.guild.roles.cache.find(
        (role) => role.name === "Muted"
      );
    }


    member.roles.remove(mutedRole); // unmutes user (removes role)

    const embed = new Discord.MessageEmbed()
      .setColor("#7CFC00")
      .setTitle("Server Unmute")
      .addFields(
        { name: "Unmuted", value: `<@${member.user.id}>`},
        { name: "Moderator", value: `<@${author.id}>` }
      )
      .setTimestamp()
      .setFooter(`Requested by ${author.tag}`, author.avatarURL());

    channel.send(embed);
  }
};
