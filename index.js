require("dotenv").config();

const ms = require("ms");
const path = require("path");
const { CommandoClient } = require("discord.js-commando");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const MongoDBProvider = require("commando-provider-mongo");

const mongo = require("./mongo");
const guildSchema = require("./schemas/guild-schema");
const welcomeSchema = require("./schemas/welcome-schema");

const redis = require("./redis");

const redisKeyPrefix = "muted-";
const redisWolframPrefix = "wolfram-expire";

global.cache = { starboards: {} }; // memory data

const bot = new CommandoClient({
  owner: process.env.CREATOR,
  commandPrefix: ".",
  disableEveryone: true
});

bot.setProvider(
  MongoClient.connect(process.env.MONGO_URL)
    .then((bot) => {
      return new MongoDBProvider(bot);
    })
    .catch((err) => {
      console.log(err);
    })
);

bot.login(process.env.BOT_TOKEN);

bot.on("ready", async () => {
  bot.registry
    .registerGroups([
      ["moderation", "Moderation commands"],
      ["utility", "Utility commands"],
      ["text", "Text commands"],
      ["images", "Image commands"],
      ["animals", "Animal commands"],
      ["starboard", "Starboard commands"]
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, "cmds"));

  bot.user.setActivity("with beta commands");
  console.log(`Signed in as ${bot.user.tag}!`);
});

bot.on("guildCreate", async (guild) => {
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
  if (cache[guild.id] && cache[guild.id].welcome != null)
    data = cache[guild.id].welcome;
  else {
    await mongo().then(async (mongoose) => {
      // if no welcome message, retreive from DB
      try {
        const result = await welcomeSchema.findOne({ _id: guild.id });
        cache[guild.id] = data = [result.channel, result.text]; // saves welcome message form DB to cache
      } finally {
        mongoose.connection.close();
      }
    });
  }

  const channel = guild.channels.cache.get(data[0]); // gets welcome message channel
  channel.send(data[1].replace(/<@>/g, `<@${member.id}>`)); // sends welcome message to channel
});

bot.on("message", async (message) => {
})

bot.on("messageReactionAdd", async (reaction, user) => {
  const { message } = reaction;
});

bot.on("messageReactionRemove", async (reaction, user) => {

});

/*** CALLED WHEN REDIS EXPIRES ***/
redis.expire(async message => {
  const redisClient = await redis();
  try {
    redisClient.set(redisWolframPrefix, "true", "EX", ms("1d") / 1000);
  } finally {
    redisClient.quit();
  }

  /*** MUTE EXPIRE ***/
  if (message.startsWith(redisKeyPrefix)) {
    const split = message.split("-"); // mute-USER_ID-SERVER_ID -> [mute, user_id, server_id]

    const guild = bot.guilds.cache.get(split[2]);
    const member = guild.members.cache.get(split[1]);
    const role = guild.roles.cache.find((role) => role.name === "Muted"); // get mute role

    member.roles.remove(role);
  }
})