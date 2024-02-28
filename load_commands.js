import { REST, Routes } from "discord.js";
import { client_id, token } from "./config.js";

const commands = [
  {
    name: "ping",
    description: "Responde si esta despierto",
  },
  {
    name: "activar",
    description: "Guarda en la base de datos cuando se solicita una activacion",
    options: [
      {
        name: "cliente",
        description: "Nombre del cliente en flokzu",
        type: 3,
        required: true,
      },
      {
        name: "onu",
        description: "MAC de la ONU a activar",
        type: 3,
        required: true,
      },
      {
        name: "router",
        description: "MAC del router a activar",
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: "cerrar",
    description: "Guarda en la base de datos cuando se solicita una activacion",
    options: [
      {
        name: "onu",
        description: "MAC de la ONU activada",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "planificacion",
    description: "Guarda en la base de datos cuando se solicita una activacion",
    options: [
      {
        name: "descripcion",
        description:
          "Guarda un registro de la planificacion realizada en el dia",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "asignados",
    description: "Muestra las tareas asignadas a los tecnicos",
  },
  {
    name: "devueltas",
    description: "Muestra las tareas no completadas por los tecnicos",
  },
  {
    name: "fecha",
    description:
      "Muestra la lista de tareas con la fecha ingresada en formato dd-mm-yyyy",
    options: [
      {
        name: "fecha",
        description: "guarda la fecha que se desea solicitar",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "cancelar",
    description: "Eliminamos el registro de planificacion",
    options: [
      {
        name: "id",
        description: "id del registro a cancelar",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "ayuda",
    description: "Informacion de los diferentes comandos",
  },
  {
    name: "filtrar",
    description: "Buca un cliente por su cedula en wisphb",
    options: [
      {
        name: "cedula",
        description: "cedula del cliente",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "activarservicio",
    description: "Activa Servicio De Cliente",
    options: [
      {
        name: "id",
        description: "ID del Servicio del Cliente",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "desactivarservicio",
    description: "Desactivar Servicio De Cliente",
    options: [
      {
        name: "id",
        description: "ID del Servicio del Cliente",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name : "promedio",
    description : "Muestra un promedio en base a las ultimas instalaciones medibles"
  },
  {
    name: "registros",
    description: "Verifica el estado de las tareas de un tecnico segun un dia",
    options: [
      {
        name: "tecnico",
        description: "Correo del tecnico que lo realizo",
        type: 3,
        required: true,
      },
      {
        name: "fecha",
        description: "Fecha a filtrar en formato 'd-m-Y'",
        type: 3,
        required: true,
      },
    ],
  },
  
];

const rest = new REST({ version: "10" }).setToken(token);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(client_id), { body: commands });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
