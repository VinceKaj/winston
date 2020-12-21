const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const starboardSchema = require("../../schemas/starboard-schema");
const mongo = require("./../../mongo");

async function Min(message, args) {
  const { author, channel, guild } = message;

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

  if (args)
    args = args.toLowerCase();

  if (args == "default")
    args = "3";
  
  const num = args*1;
  if (args && Number.isInteger(num)) {

    /* Already set to value */
    if (num == cache[guild.id].stardata.min) {
      channel.send(`Minimum :star: count already set to ${num}.`);
      return;
    }

    /* If less than 1 */
    if (num < 1) {
      channel.send("Minimum :star: count cannot be less than 1.");
      return;
    }

    cache[guild.id].stardata.min = num;
    const embed = new Discord.MessageEmbed()
      .setColor("#fcebb5")
      .setTitle("Starboard Edited")
      .setDescription(
        `<@${author.id}> successfully edited <#${
          cache[guild.id].stardata.channel
        }>`
      )
      .addField("Minimum :star: count", `Set to ${num}`)
      .setFooter(`Requested by ${author.tag}`, author.avatarURL())
      .setTimestamp();

    channel.send(embed);

  } else if (args) {
    channel.send("Please provide a valid integer.")
    return;
  } else {
    channel.send(`Minimum :star: count is set to ${cache[guild.id].stardata.min}.`);
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

module.exports = { Min };