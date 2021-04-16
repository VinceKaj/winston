const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class PurgeCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "purge",
      group: "moderation",
      memberName: "clear",
      description: "bulk delete messages in a channel",
      format: `{amount}`,
      examples: [`.purge 100`],
      aliases: ["clear"],
      clientPermissions: ["MANAGE_MESSAGES"],
      userPermissions: ["MANAGE_MESSAGES"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { author, channel, guild } = message;

    if (!Number.isInteger(args*1) || args < 1)
      return channel.send("Please give me a valid integer to purge messages.");
    
    if(args > 100)
      return channel.send("I cannot clear more than 100 messages.");

    message.delete(); // delete command message

    channel.messages.fetch({
      limit: args*1,
    })
    .then((messages) => {
      channel.bulkDelete(args * 1);
      // Logging the number of messages deleted on both the channel and console.
      channel
        .send(`I deleted **${args}** messages.`)
        .then((msg) => msg.delete({ timeout: 2000 }));
    })
    .catch((err) => {
      console.log("Error while doing Bulk Delete\n" + err);
    });
  }
};
