import { REST, Routes } from "discord.js";
import 'dotenv/config'

const commands = [
  {
    name: "ping",
    description: "Responde si esta despierto",
  },

];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
try {
  console.log("Comenzando a actualizar los comandos de la aplicación (/).");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

  console.log("Comandos de la aplicación (/) Actualizados correctamente.");
} catch (error) {
  console.error(error);
}
