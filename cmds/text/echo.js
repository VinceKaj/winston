const { Command } = require("discord.js-commando");
const Discord = require("discord.js");

module.exports = class EchoCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "echo",
      group: "text",
      memberName: "echo",
      description: "send a message to a specific channel",
      format: `[channel] {message}`,
      examples: [".echo hello, my name is Wilson!", ".echo #general this message is in general :eyes:"],
      aliases: ["say"],
      argsType: "multiple",
      guildOnly: true
    });
  }

  async run(message, args) {
    let { channel, mentions, member } = message;

    if (args[0]) {

      if (args[0].startsWith("<#")) {
        channel = mentions.channels.first();
        args = args.slice(1, args.length).join(" ");
      }

      if (!member.permissionsIn(channel.id).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) { // no send permission 
        message.channel.send( "You do not have permission to send messages in that channel." );
        return;
      }

      if (!channel.permissionsFor(this.client.user).has("SEND_MESSAGES")) {
        message.channel.send("I do not have permission to send messages in that channel.");
        return;
      }

      channel.send(args);
      message.react("✅");
    } else {
      channel.send("I cannot send empty messages.");
    }
  }
};
