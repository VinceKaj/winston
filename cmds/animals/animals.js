const fetch = require("node-fetch");

async function fetchAnimal(message, args, animal) {

  const msg = await message.channel.send(`Loading your ${(animal == "birb" ? "bird" : animal)} ${(args == "fact" ? "fact" : "picture")}...`)

  const result = await fetch(`https://some-random-api.ml/animal/${animal}`, {
    method: "Get",
  });
  const json = await result.json();

  if (args == "fact") {
    msg.edit(json.fact);
  } else {
    message.channel.send('', { files: [json.image]}).then(() => {msg.delete()});
  }
}

module.exports = { fetchAnimal };
