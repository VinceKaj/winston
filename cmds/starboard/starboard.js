const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const starboardSchema = require("../../schemas/starboard-schema");
const mongo = require("../../mongo");

const selfStarFunction = require("./selfStarFunction");
const starboardminFunction = require("./starboardMinFunction")

module.exports = class WelcomeCommand extends (
  Command
) {

  constructor(bot) {
    super(bot, {
      name: "starboard",
      group: "starboard",
      memberName: "starboard",
      description: "Create, delete, enable and disable starboard channel",
      examples: [
        "starboard {command}",
        `.starboard create`,
        ".starboard delete",
        ".starboard disable",
      ],
      argsType: "multiple",
      userPermissions: ["MANAGE_GUILD"],
      clientPermissions: ["MANAGE_CHANNELS"],
      guildOnly: true,
    });
  }

  async run(message, args) {
    const { author, channel, guild } = message;

    if (!args[0])
      args[0] = "not given";
    else
      args[0] = args[0].toLowerCase();

    if (!cache[guild.id] || !cache[guild.id].stardata) {
      if (!cache[guild.id]) cache[guild.id] = {}; // instantiate guild object if not yet created

      // if guild not cached, or starboard not cached
      await mongo().then(async (mongoose) => {
        // if no welcome message, retreive from DB
        try {
          const result = await starboardSchema.findOne({ _id: guild.id });
          cache[guild.id].stardata = result; // saves starboard data (object) to cache
        } finally {
          mongoose.connection.close();
        }
      });
    }

    if (args[0] == "create") {
      // create new starboard
      /*** IF THERE'S A STARBOARD ***/
      if (cache[guild.id].stardata && cache[guild.id].stardata.channel) {
        channel.send(
          `You already have a <#${
            cache[guild.id].stardata.channel
          }>. Delete the current one with \`starboard delete\` before creating a new one.`
        );
        return;
      }

      let schannel = guild.channels.cache.find(
        (channel) => channel.name.toLowerCase() === "starboard"
      ); // find starboard
      if (!schannel) {
        // starboard doesn't exit
        schannel = await guild.channels.create("starboard", {
          reason: "Channel for starred messages",
        }); // create starboard
      }
      // Set permissions:
      schannel.overwritePermissions([
        { id: guild.id, deny: ["SEND_MESSAGES"] },
        { id: process.env.WINSTON, allow: ["SEND_MESSAGES"] },
      ]);

      /* Create starboard object in cache */
      cache[guild.id].deleteStarboard = false;

      cache[guild.id].stardata = {
        channel: schannel.id,
        min: 3,
        selfStar: false,
        boards: [],
        messages: [],
        enabled: true,
      };

      const sdata = cache[guild.id].stardata;

      const embed = new Discord.MessageEmbed()
        .setColor("#fcebb5")
        .setTitle("Starboard Created")
        .setDescription(
          `<@${author.id}> successfully created <#${schannel.id}>`
        )
        .addField("Minimum number of :star:", `Set to ${sdata.min}`)
        .addField("Self-star setting", `Set to ${sdata.selfStar}`)
        .addField("Enabled", `Set to ${sdata.enabled}`)
        .addField(
          "You can edit starboard settings with:",
          "`starboard selfstar {enable/disable}`\n" +
            "`starboard min {minimum count}`\n" +
            "`starboard enable`\n" +
            "`starboard disable`\n" +
            "`starboard delete`"
        )
        .setFooter(`Requested by ${author.tag}`, author.avatarURL())
        .setTimestamp();

      channel.send(embed);
    } else if (args[0] == "delete") {
      if (
        !cache[guild.id] ||
        !cache[guild.id].stardata ||
        !cache[guild.id].stardata.channel
      ) {
        channel.send(
          "You do not have a starboard on this server. You can create/find one with `starboard create`"
        );
        return;
      }

      cache[guild.id].deleteStarboard = true;
      channel.send(
        "Are you sure you want to delete starboard?\nUse `starboard confirm` command to **delete starboard**"
      );
      return;
    } else if (args[0] == "confirm") {
      if (cache[guild.id].deleteStarboard != true) {
        channel.send(
          "There's nothing to confirm. Use `starboard delete` to delete starboard."
        );
        return;
      }

      /*** Delete starboard ***/
      const starboardChannel = guild.channels.cache.get(
        cache[guild.id].stardata.channel
      );

      try {
        starboardChannel.delete();
      } catch (e) {}

      /* Deletes from cache */
      cache[guild.id].stardata = {
        channel: "",
        messages: [],
        boards: [],
        min: 0,
        selfStar: false,
        enabled: false,
      };

      const embed = new Discord.MessageEmbed()
        .setColor("#fcebb5")
        .setTitle("Starboard Deleted")
        .setDescription(`<@${author.id}> successfully deleted #starboard`)
        .addField("You can create a new starboard with", "`starboard create`")
        .setFooter(`Requested by ${author.tag}`, author.avatarURL())
        .setTimestamp();

      channel.send(embed);
    } else if (args[0] == "disable" || args[0] == "false") {
      /* If no starboard */
      if (!cache[guild.id].stardata || !cache[guild.id].stardata.channel) {
        channel.send(
          "You do not have a starboard on this server. You can create/find one with `starboard create`"
        );
        return;
      }

      /* If disabled already */
      if (cache[guild.id].stardata.enabled == false) {
        channel.send(
          `<#${cache[guild.id].stardata.channel}> is already disabled.`
        );
        return;
      }

      /* Disable starboard */
      cache[guild.id].stardata.enabled = false;
      const embed = new Discord.MessageEmbed()
        .setColor("#fcebb5")
        .setTitle("Starboard Edited")
        .setDescription(
          `<@${author.id}> successfully edited <#${
            cache[guild.id].stardata.channel
          }>`
        )
        .addField("Enabled", "Set to false")
        .setFooter(`Requested by ${author.tag}`, author.avatarURL())
        .setTimestamp();

      channel.send(embed);
    } else if (args[0] == "enable" || args[0] == "false") {
      /* If no starboard */
      if (!cache[guild.id].stardata || !cache[guild.id].stardata.channel) {
        channel.send(
          "You do not have a starboard on this server. You can create/find one with `starboard create`"
        );
        return;
      }

      /* If enabled already */
      if (cache[guild.id].stardata.enabled == true) {
        channel.send(
          `<#${cache[guild.id].stardata.channel}> is already enabled.`
        );
        return;
      }

      /* Enable starboard */
      cache[guild.id].stardata.enabled = true;
      const embed = new Discord.MessageEmbed()
        .setColor("#fcebb5")
        .setTitle("Starboard Edited")
        .setDescription(
          `<@${author.id}> successfully edited <#${
            cache[guild.id].stardata.channel
          }>`
        )
        .addField("Enabled", "Set to true")
        .setFooter(`Requested by ${author.tag}`, author.avatarURL())
        .setTimestamp();

      channel.send(embed);
    } else if (args[0] == "selfstar" || args[0] == "self-star") {
      selfStarFunction.SelfStar(message, args.slice(1, args.length).join(" "));
      return;
    } else if (args[0] == "min" || args[0] == "minimum") {
      starboardminFunction.Min(message, args.slice(1, args.length).join(" "));
      return;
    } else {
      channel.send(
        "__Starboard commands:__\n" +
          "`starboard min {integer}`: set minimum :star: count for messages to get to starboard\n" +
          "`starboard selfstar {enable/disable}`: change whether users can add stars to their own messages\n" +
          "`starboard create`: creates a new starboard channel\n" +
          "`starboard delete`: deletes the starboard channel\n" +
          "`starboard confirm`: confirms starboard deletion\n" +
          "`starboard enable`: enable the starboard, starred messages will go to #starboard\n" +
          "`starboard disable`: disable the starboard, no messages will be sent to #starboard"
      );
      return;
    }

    await mongo().then(async (mongoose) => {
      try {
        const stardata = cache[guild.id].stardata;
        await starboardSchema.findOneAndUpdate(
          {
            _id: guild.id,
          },
          {
            _id: guild.id,
            channel: stardata.channel,
            boards: stardata.boards,
            messages: stardata.messages,
            selfStar: stardata.selfStar,
            min: stardata.min,
            enabled: stardata.enabled,
          },
          {
            upsert: true,
          }
        );
      } catch (e) {
        console.log(e);
      } finally {
        mongoose.connection.close();
      }
    });
  }
};
