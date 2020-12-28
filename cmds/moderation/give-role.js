const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class GiveRoleCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "give-role",
      group: "moderation",
      memberName: "give-role",
      description: "add one (or many) roles to one (or many) users (handy for mobile)",
      aliases: ["giverole", "give-roles", "giveroles"],
      format: `{@user} [@another_user] {@role} [@another_role]`,
      examples: [
        `<@${process.env.CREATOR}> @Admin @Friend`,
        `<@${process.env.creator}> <@${process.env.WINSTON}> @Members`,
      ],
      argsType: "multiple",
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { author, channel, guild, member } = message;
    let members = [];
    let roles = [];

    // member.roles.highest
    // role.comparePositionTo(role)

    if (!message.member.hasPermission("MANAGE_ROLES")) {
      channel.send('The `give-role` command requires you to have the "Manage roles" permission.');
      return;
    }

    /* Get arrays of mentioned roles and members */
    if (args[0]) {
      for(const i in args) {
        if (args[i].startsWith("<@") && args[0].endsWith(">")) { // mention
          let target = args[i].slice(2, -1);

          if (target.startsWith("&")) { // roke
            target = target.slice(1);
            roles.push(guild.roles.cache.get(target));
            continue;
          }

          if (target.startsWith("!")) target = target.slice(1);
          members.push(guild.members.cache.get(target));
        }
      }
    }

    /* Lack of args */
    if (!members[0]) {
      channel.send("Please specify a member to add roles to.");
      return;
    } else if (!roles[0]) {
      channel.send("Please specify roles to add.");
      return;
    }

    const highest = member.roles.highest; // highest role of author

    /* Checks if any roles are above author */
    for (const i in roles) {
      const result = highest.comparePositionTo(roles[i]);
      if (result <= 0) {
        channel.send("You cannot give roles higher than yours.");
        return;
      }
    }

    /* Add roles to members */
    for (const i in members) {
      for (const j in roles) {
        members[i].roles.add(roles[j]);
      }
    }

    /* Form strings "@User1, @User2, ..." */
    let roleStr = "", memberStr = "";
    for (const i in roles) {
      roleStr += `<@&${roles[i].id}>, `;
    } roleStr = roleStr.slice(0, -2); // remove ", " at the end

    for (const i in members) {
      memberStr += `<@${members[i].id}>, `;
    } memberStr = memberStr.slice(0, -2); // remove ", " at the end

    const embed = new Discord.MessageEmbed()
      .setColor("#7CFC00")
      .setTitle("Roles Given Successfully")
      .addFields(
        { name: "Members", value: memberStr },
        { name: "Roles", value: roleStr }
      )
      .setTimestamp()
      .setFooter(`Requested by ${author.tag}`, author.avatarURL());

    channel.send(embed);
  }
};
