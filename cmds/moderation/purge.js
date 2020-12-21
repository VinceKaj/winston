const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class KickCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "purge",
      group: "moderation",
      memberName: "clear",
      description: "bulk delete messages in a channel",
      examples: [
        "clear {amount}",
        `.clear 100`,
      ],
      clientPermissions: ["MANAGE_MESSAGES"],
      userPermissions: ["MANAGE_MESSAGES"],
      guildOnly: true,
    });
  }

  async run(message, args) {

    const { author, channel, guild } = message;

    if (!Number.isInteger(args))
      return channel.send("Please give me an integer to purge messages.");
    
    if(args > 100)
      return channel.send("I cannot clear more than 100 messages.");

      channel.messages.fetch({
        limit: args*1,
      })
      .then((messages) => {
        channel.bulkDelete(messages);
        // Logging the number of messages deleted on both the channel and console.
        channel
          .send(`I deleted **${args}** messages.`)
          .then((message) => message.delete(5000));
      })
      .catch((err) => {
        console.log("Error while doing Bulk Delete\n" + err);
      });
  }
};
