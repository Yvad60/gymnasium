import { REST, Routes } from "discord.js";

const commands = [
  {
    name: "get_news",
    description: "get trending news ",
  },
];

const rest = new REST({ version: "10" }).setToken(
  "MTEwNTIyNDY2NDYwMDU1MTU3NA.GTkPh2.tLwkoNrIbg67IB5Krb-sN0PjtzpETl-wu4B1BA"
);

(async () => {
  try {
    console.log("Started calling....");
    await rest.put(Routes.applicationGuildCommands("1105224664600551574", "1105228411422650465"), {
      body: commands,
    });

    console.log("Success");
  } catch (error) {
    console.log(error);
  }
})();
