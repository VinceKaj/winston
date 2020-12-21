const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const starboardSchema = require("../../schemas/starboard-schema");
const mongo = require("./../../mongo");

async function SelfStar(message, args) {
  const { guild, channel, author } = message;

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

    if (!cache[guild.id].stardata || !cache[guild.id].stardata.channel) {
      channel.send(
        "You do not have a starboard on this server. You can create/find one with `starboard create`"
      );
      return;
    }

    if (args) args = args.toLowerCase();

    if (args == "default" || args == "false" || args == "disable") {

      /* If already disabled */
      if (cache[guild.id].stardata.selfStar == false) {
        channel.send("Starboard self-starring is already disabled.");
        return;
      }

      cache[guild.id].stardata.selfStar == false;
      const embed = new Discord.MessageEmbed()
        .setColor("#fcebb5")
        .setTitle("Starboard Edited")
        .setDescription(
          `<@${author.id}> successfully edited <#${
            cache[guild.id].stardata.channel
          }>`
        )
        .addField("Self-star", `Set to ${cache[guild.id].stardata.selfStar}`)
        .setFooter(`Requested by ${author.tag}`, author.avatarURL())
        .setTimestamp();

      channel.send(embed);

    } else if (args == "true" || args == "enable") {
      /* If already enabled */
      if (cache[guild.id].stardata.selfStar == true) {
        channel.send("Starboard self-starring is already enabled.");
        return;
      }

      cache[guild.id].stardata.selfStar = true;
      const embed = new Discord.MessageEmbed()
        .setColor("#fcebb5")
        .setTitle("Starboard Edited")
        .setDescription(
          `<@${author.id}> successfully edited <#${
            cache[guild.id].stardata.channel
          }>`
        )
        .addField("Self-star", `Set to ${cache[guild.id].stardata.selfStar}`)
        .setFooter(`Requested by ${author.tag}`, author.avatarURL())
        .setTimestamp();

      channel.send(embed);
    } else {
      channel.send(`Starboard self-star setting is currently set to ${cache[guild.id].stardata.selfStar}.`);
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

module.exports = { SelfStar }