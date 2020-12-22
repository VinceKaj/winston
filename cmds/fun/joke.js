const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = class JokeCommand extends (
  Command
) {
  constructor(bot) {
    super(bot, {
      name: "joke",
      group: "fun",
      memberName: "joke",
      format: `[category]`,
      description:
        "tells you a joke from a category: yo mama, chuck norris, dad, programming, christmas, pun, miscellaneous, dark, spooky, none",
      examples: [".joke Chuck Norris", ".joke"],
    });
  }

  async run(message, args = "") {
    const { channel } = message;

    args = args.toLowerCase().replace(/\W/g, "");

    let result, json, joke;

    switch (args) {
      default:
        result = await fetch(`https://some-random-api.ml/joke`);
        json = await result.json();
        joke = json.joke;
        break;
      case "chucknorris":
        result = await fetch(`https://api.chucknorris.io/jokes/random`);
        json = await result.json();
        joke = json.value;
        break;
      case "yomama":
        result = await fetch(`https://api.yomomma.info/`);
        json = await result.json();
        joke = json.joke;
        break;
      case "programming":
      case "christmas":
      case "pun":
      case "miscellaneous":
      case "dark":
      case "spooky":
        result = await fetch(
          `https://sv443.net/jokeapi/v2/joke/${args}?blacklistFlags=nsfw,religious,political,racist,sexist`
        );
        json = await result.json();
        if (json.type == "twopart") joke = json.setup + "\n" + json.delivery;
        else joke = json.joke;
        break;
    }

    channel.send(joke);
  }
};
