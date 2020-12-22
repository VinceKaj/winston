const fetch = require("node-fetch");

async function fetchAnimal(message, args, animal) {
  const result = await fetch(`https://some-random-api.ml/animal/${animal}`, {
    method: "Get",
  });
  const json = await result.json();

  if (args && args == "fact") {
    message.channel.send(json.fact);
  } else {
    message.channel.send("", { files: [json.image] });
  }
}

module.exports = { fetchAnimal };
