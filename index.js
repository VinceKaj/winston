require("dotenv").config();

const ms = require("ms");
const path = require("path");
const { CommandoClient } = require("discord.js-commando");
const Discord = require("discord.js");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const MongoDBProvider = require("commando-provider-mongo");

const mongo = require("./mongo");
const guildSchema = require("./schemas/guild-schema");
const welcomeSchema = require("./schemas/welcome-schema");
const starboardSchema = require("./schemas/starboard-schema");

const redis = require("./redis");
const { DiscordAPIError } = require("discord.js");

const redisKeyPrefix = "muted-";
const redisReminderPrefix = "reminder-";
const redisWolframPrefix = "wolfram-expire";

const TOKEN =
  (process.env.MODE == "DEVELOPER"
    ? process.env.BETA_TOKEN
    : process.env.BOT_TOKEN);
const PREFIX = (process.env.MODE == "DEVELOPER" ? "?" : ".");
const MONGO_URL = (process.env.MODE == "DEVELOPER" ? process.env.MONGO_URL_OLD : process.env.MONGO_URL);

global.cache = { starboards: {} }; // memory data

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

const bot = new CommandoClient({
  owner: process.env.CREATOR,
  commandPrefix: PREFIX,
  disableEveryone: true,
  unknownCommandResponse: false,
  invite: "https://discord.gg/P8xBnNdvSX",
});

bot.setProvider(
  MongoClient.connect(MONGO_URL)
    .then((bot) => {
      return new MongoDBProvider(bot);
    })
    .catch((err) => {
      console.log(err);
    })
);

client.login(TOKEN);

bot.login(TOKEN);

bot.on("ready", async () => {
  bot.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
      unknownCommand: false,
    })
    .registerGroups([
      ["animals", "Animal commands"],
      ["fun", "Fun commands"],
      ["images", "Image commands"],
      ["moderation", "Moderation commands"],
      ["starboard", "Starboard commands"],
      ["text", "Text commands"],
      ["utility", "Utility commands"],
    ])
    .registerCommandsIn(path.join(__dirname, "cmds"));

  if (process.env.MODE != "DEVELOPER")
    bot.user.setActivity(`${bot.guilds.cache.size} servers`, {
      type: "WATCHING",
    });
  console.log(`Signed in as ${bot.user.tag}!`);
});

bot.on("guildCreate", async (guild) => {
  if (process.env.MODE != "DEVELOPER")
    bot.user.setActivity(`${bot.guilds.cache.size} servers`, {
      type: "WATCHING",
    }); // WATCHING {AMOUNT} SERVERS

  /*** Add new guild to database ***/
  await AddGuildToMongo(guild);
});

async function AddGuildToMongo(guild) {
  await mongo().then(async (mongoose) => {
    try {
      await guildSchema.findOneAndUpdate(
        {
          _id: guild.id,
        },
        {
          _id: guild.id,
          simpleWolframQueries: 0,
          longWolframQueries: 0,
          simpleWolframQueriesTotal: 0,
          longWolframQueriesTotal: 0,
          memberCount: guild.memberCount,
          dateJoined: new Date(),
          premium: false,
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

bot.on("guildMemberAdd", async (member) => {
  /*** MUTES ***/
  const { guild, id } = member;
  const redisClient = await redis();
  try {
    redisClient.get(`${redisKeyPrefix}${id}`, (err, result) => {
      if (err) {
        console.error("Redis GET error:", err);
      } else if (result) {
        // if the user was muted
        const role = guild.roles.cache.find((role) => role.name === "Muted"); // get mute role
        if (role) {
          member.roles.add(role); // mute user
        }
      }
    });
  } finally {
    redisClient.quit();
  }

  /*** WELCOME MESSAGE ***/
  let data;

  if (!cache[guild.id]) cache[guild.id] = {};

  if (cache[guild.id] && cache[guild.id].welcome != null) {
    data = cache[guild.id].welcome;
  } else {
    await mongo().then(async (mongoose) => {
      // if no welcome message, retreive from DB
      try {
        const result = await welcomeSchema.findOne({ _id: guild.id });
        cache[guild.id].welcome = data = [result.channel, result.text]; // saves welcome message form DB to cache
      } finally {
        mongoose.connection.close();
      }
    });
  }

  const channel = guild.channels.cache.get(data[0]); // gets welcome message channel
  channel.send(data[1].replace(/<@>/g, `<@${member.id}>`)); // sends welcome message to channel
});

bot.on("message", async (message) => {});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.partial) await reaction.fetch();

  StarboardManager(reaction, user); // All starboard reaction functionality
});

// Called in "messageReactionAdd"
async function StarboardManager(reaction, user) {
  const { message, emoji } = reaction;
  const { guild, channel, author, attachments } = message;

  if (channel.type == "dm") return; // NO DMS

  /*** Fetch the starboard channel ***/
  if (!cache[guild.id] || !cache[guild.id].stardata) {
    // if guild not cached, or starboard not cached

    if (!cache[guild.id]) cache[guild.id] = {}; // initialize cache[guild.id]

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

  const stardata = cache[guild.id].stardata;

  /*** Starboard ***/
  if (stardata) {
    // if there's a starboard

    if (channel.id != stardata.channel) {
      // if starred message not in starboard
      let reacts = reaction.count;

      if (stardata.selfStar == false && user.id == author.id) {
        // if self-starring not allowed, and author self-starred
        reacts--; // remove one reaction counter
      }

      if (reacts >= stardata.min && emoji.name == "⭐") {
        // reaction is a star & more than minimum

        /* Find starboard channel */
        const schannel = guild.channels.cache.get(stardata.channel);
        if (!schannel) {
          // channel was deleted
          schannel = guild.channels.cache.find(
            (channel) => channel.name.toLowerCase() === "starboard"
          ); // find by name
          if (schannel)
            // if found one
            stardata.channel = schannel.id;
          // no starboard
          else return; // skips starboard functionality
        }

        /* Create Embed */
        const image =
          attachments.size > 0 ? await attachments.array()[0].url : ""; // get image if there is one

        const embed = new Discord.MessageEmbed()
          .setColor("#fcebb5")
          .setAuthor(author.tag, author.avatarURL())
          .setDescription(message.content)
          .addField("Source", `[Jump!](${message.url})`)
          .setTimestamp()
          .setFooter(`ID: ${message.id}`)
          .setImage(image);

        if (stardata.messages.includes(message.id)) {
          // message in starboard
          const index = stardata.messages.indexOf(message.id);
          const starMsg = stardata.boards[index];
          const starboardMessage = schannel.messages.cache.get(starMsg);

          if (starboardMessage) {
            // if starboard message wasn't deleted
            const starEmoji = reacts > stardata.min ? ":star2:" : ":star:"; // sets the star emoji

            starboardMessage.edit(
              `${starEmoji} **${reacts}** | <#${channel.id}>`,
              {
                embed: embed,
              }
            ); // edit the message
          } else {
            const newMessage = await starboard.send(
              `:star: **${reacts}** | <#${channel.id}>`,
              { embed: embed }
            ); // send message
            stardata.boards[index] = newMessage.id;
          }
        } else {
          // message not yet in starboard
          const newMessage = await schannel.send(
            `:star: **${reacts}** | <#${channel.id}>`,
            { embed: embed }
          ); // send message
          stardata.messages.push(message.id); // adds to stardata array
          stardata.boards[stardata.messages.length - 1] = newMessage.id; // ensures indexes match
        }

        cache[guild.id] = stardata; // updates stardata object
        await mongo().then(async (mongoose) => {
          try {
            await starboardSchema.findOneAndUpdate(
              {
                _id: guild.id,
              },
              {
                boards: stardata.boards,
                messages: stardata.messages,
              }
            );
          } catch (e) {
            console.log(e);
          } finally {
            mongoose.connection.close();
          }
        });
      }
    }
  }
}

client.on("messageReactionRemove", async (reaction, user) => {});

/*** CALLED WHEN REDIS EXPIRES ***/
redis.expire(async (message) => {
  const redisClient = await redis();
  try {
    redisClient.set(redisWolframPrefix, "true", "EX", ms("1d") / 1000);
  } finally {
    redisClient.quit();
  }

  /*** MUTE EXPIRE ***/
  if (message.startsWith(redisKeyPrefix)) {
    const split = message.split("-"); // mute-USER_ID-SERVER_ID -> [mute, user_id, guild_id]
    const guild = bot.guilds.cache.get(split[2]);
    const member = guild.members.cache.get(split[1]);
    const role = guild.roles.cache.find((role) => role.name === "Muted"); // get mute role

    member.roles.remove(role);
  }

  /*** REMINDER EXPIRE ***/
  if (message.startsWith(redisReminderPrefix)) {
    const split = message.split("-"); // ["reminder", user_id, interval, message...]

    const user = bot.users.cache.get(split[1]);
    if (!user)
      // if not found in cache
      user = bot.users.fetch(split[1]);

    const interval = ms(split[2] * 1, { long: true }); // * 1 converts into number (needed)
    const reminder = split.slice(3, split.length).join(" ");

    const embed = new Discord.MessageEmbed()
      .setColor("#8111d1")
      .setTitle("Reminder")
      .setDescription(
        `${interval} ago you asked me to remind you:\n${reminder}`
      )
      .setTimestamp()
      .setFooter(`Requested by ${user.tag}`, user.avatarURL());

    user.send(embed);
  }
});
