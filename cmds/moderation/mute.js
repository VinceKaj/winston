const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const ms = require("ms");
const redis = require("./../../redis.js");

module.exports = class MuteCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "mute",
      group: "moderation",
      memberName: "mute",
      description: "Mute a user in all text channels)",
      examples: [
        "mute {user} [duration] [reason]",
        `.mute <@${process.env.CREATOR}> 2h for spam`,
      ],
      argsType: "multiple",
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { author, channel, content, guild } = message;

    /* GET USER TO MUTE */
    if (!args[0]) {
      channel.send("Please specify a member to mute.");
      return;
    }

    let target;
    if (args[0].startsWith("<@") && args[0].endsWith(">")) {
      // if is a mention
      target = args[0].slice(2, -1);

      if (target.startsWith("!")) target = target.slice(1);
    }

    const member = guild.members.cache.get(target); // set user target as ID
    let duration = -1,
      reason = "None";

    /* Get Duration */
    if (args[1] && !isNaN(args[1][0])) {
      if (isNaN(args[1])) {
        duration = ms(args.slice(1, 2).join("")); // example: 5min
        if (args[2]) reason = args.slice(2, args.length).join(" ");
      } else {
        duration = ms(args.slice(1, 3).join(" ")); // example: 5 min

        if (args[3]) reason = args.slice(3, args.length).join(" ");
      }
    } else if (args[1]) reason = args.slice(1, args.length).join(" ");

    if (isNaN(duration)) {
      duration = -1;
      reason = args.slice(1, args.length).join(" ");
    }

    /* REDIS */
    if (duration > 0) {
      const redisClient = await redis();
      try {
        const redisKey = `muted-${member.id}-${guild.id}`;
        redisClient.set(redisKey, "true", "EX", duration / 1000);
      } finally {
        redisClient.quit();
      }
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

    // Make sure mute role is active on all channels
    guild.channels.cache.forEach((ch) => {
      ch.updateOverwrite(mutedRole, { SEND_MESSAGES: false });
    });

    member.roles.add(mutedRole); // add role

    let durationText;
    if (duration == -1) durationText = "Forever";
    else durationText = ms(duration, { long: true });

    const embed = new Discord.MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Server Mute")
      .addFields(
        { name: "Muted", value: member.user.tag },
        { name: "Reason", value: reason },
        { name: "Duration", value: durationText }
      )
      .setTimestamp()
      .setFooter(`Requested by ${author.tag}`, author.avatarURL());

    channel.send(embed);
  }
};
