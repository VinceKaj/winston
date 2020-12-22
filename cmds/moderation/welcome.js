const { Command } = require("discord.js-commando");
const welcomeSchema = require("../../schemas/welcome-schema");
const mongo = require("./../../mongo");

module.exports = class WelcomeCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: "setwelcome",
      group: "moderation",
      memberName: "setwelcome",
      description:
        "Set a welcome message for new members (leave blank for no message). Use `<@>` to mention new member.",
      examples: [
        "setwelcome {welcome message}",
        `.setwelcome Welcome to my server <@>! Enjoy your stay!`,
      ],
      argsType: "multiple",
      userPermissions: ["MANAGE_GUILD"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { member, channel, guild } = message;

    if (!args[0]) {
      args = [" "];
      cache[guild.id].welcome = null;
    }
    else
      cache[guild.id].welcome = [channel.id, args.join(" ")];
    
    await mongo().then(async (mongoose) => {
      try {
        await welcomeSchema.findOneAndUpdate(
          {
            _id: guild.id,
          },
          {
            _id: guild.id,
            channel: channel.id,
            text: args.join(" "),
          },
          {
            upsert: true,
          }
        );

        if (args[0] != [" "])
          channel.send(`Success! The welcome message is now:\n> ${args.join(" ")}`);
        else
          channel.send("Welcome message has been cleared.");
      } catch (e) {
        console.log(e);
      } finally {
        mongoose.connection.close();
      }
    });
  }
};
