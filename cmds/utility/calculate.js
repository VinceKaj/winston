const { Command } = require('discord.js-commando');
const calculator = require("./../../calculator");

module.exports = class CalculateCommand extends Command {
    constructor(bot) {
        super(bot, {
          name: "calculate",
          aliases: ["c", "calc"],
          group: "utility",
          format: `{query}`,
          memberName: "calculate",
          description: "calculate something with a basic calculator",
          examples: [
            ".calculate 23*47",
            ".calculate pi * 4 ^ 2",
          ],
        });
    }

    async run(message, args) {
        const { channel } = message;

        let result = calculator.calculate(args);
        //channel.send(`Input: \`${args}\`\nResult: \`${result}\``);
        channel.send(result);
    }
}