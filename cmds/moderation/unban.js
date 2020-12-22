const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class PardonCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "unban",
      group: "moderation",
      memberName: "unban",
      description: "unban a member from the server",
      examples: ["unban {user id}", `.unban ${process.env.CREATOR}`],
      argsType: "multiple",
      aliases: ["pardon"],
      clientPermissions: ["BAN_MEMBERS"],
      userPermissions: ["BAN_MEMBERS"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { guild, author, channel } = message;

    if (!args[0]) {
      message.channel.send("Please specify the of the member to unban.");
      return;
    }
    const bans = await guild.fetchBans();
    const bannedUser = (bans.size != 0 ? bans.find(b => b.user.id === args[0]) : undefined);

    if (bannedUser) {
      const embed = new Discord.MessageEmbed()
        .setColor("#c8c8c8")
        .setTitle("Server Unban")
        .addFields(
          {
            name: "Unbanned",
            value: `${bannedUser.user.tag}`,
          },
          { name: "Moderator", value: `<@${author.id}>` }
        )
        .setTimestamp()
        .setFooter(`Requested by ${author.tag}`, author.avatarURL());

      channel.send(embed);
      guild.members.unban(args[0]); // unbans the user
    } else {
      channel.send(`<@${args[0]}> (ID: ${args[0]}) is not banned.`);
    }    
  }
};
