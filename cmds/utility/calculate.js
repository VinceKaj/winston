const { Command } = require('discord.js-commando');
const calculator = require("./../../calculator");

module.exports = class AddCommand extends Command {
    constructor(bot) {
        super(bot, {
          name: "calculate",
          aliases: ["c", "calc"],
          group: "utility",
          memberName: "calculate",
          description: "calculate something with a basic calculator",
          examples: [
            "calculate {query}",
            ".calculate 23*47",
            ".calculate pi * 4 ^ 2",
          ],
        });
    }

    async run(message, args) {
        const { channel } = message;

        let result = calculator.calculate(query);
        channel.send(`Input: \`${args}\`\nResult: \`${result}\``);
    }
}