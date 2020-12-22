const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const ms = require("ms");
const redis = require("./../../redis.js");

module.exports = class RemindCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "remindme",
      aliases: ["reminder", "rm"],
      group: "utility",
      memberName: "remindme",
      description: "be reminded of something in a given interval",
      examples: [
        "remindme {interval} [information]",
        ".remindme 3d",
        ".remindme 1h dinner is ready",
      ],
      argsType: "multiple",
    });
  }

  async run(message, args) {
    const { channel, author, guild } = message;

    if (!args[0] || isNaN(args[0][0])) {
      channel.send("Please give a valid interval");
      return;
    }

    let interval = 0;
    let reminder = "nothing.";

    if (args[1]) {
      interval = ms(args[0] + args[1]);

      if (args[2])
        reminder = args.slice(2, args.length).join(" ");
    }

    if (!interval) { // first two words not valid interval
      interval = ms(args[0]);

      if (args[1])
        reminder = args.slice(1, args.length).join(" ");
    }

    if (isNaN(interval) || interval/1000 < 1) {
      channel.send("Interval too small. Must be at least 1 second.");
      return;
    }

    interval = Math.floor(interval/1000);

    /*** REDIS ***/
    const redisClient = await redis();
    try {
      const redisKey = `reminder-${author.id}-${interval*1000}-${reminder}`;
      redisClient.set(redisKey, "true", "EX", interval);
    } finally {
      redisClient.quit();
    }

    channel.send(`Alright, <@${author.id}>, I'll remind you about "${reminder}" in **${ms(interval*1000, { long: true })}**.`);
  }
};
