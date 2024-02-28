import { Client, Events, GatewayIntentBits, Message } from "discord.js";
import { token } from "./config.js";
import moment from "moment";
let mensaje = "";

var now = moment().format("DD/MM/YYYY HH:mm:ss");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.once(Events.ClientReady, (c) => {
  console.log("Bot conectado! \nCliente: " + c.user.tag + "\n" + now);
});
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "ping") {
    await interaction.reply("El bot Esta activo actualmente");
  }
  if (interaction.commandName === "activar") {
    const onu = interaction.options.getString("onu");
    const router = interaction.options.getString("router");
    const cliente = interaction.options.getString("cliente");

    postData("https://connectionseyt.net/TiemposCyS/crear", {
      ID: onu,
      Tecnico: interaction.user.globalName,
      fecha: now,
    }).then((data) => {
      if (data.msg == "se guardo") {
        interaction.reply(
          `Nombre del cliente: ${cliente} \nONU: ${onu} \nRouter: ${router} \nApresurate a activar :hourglass_flowing_sand::hourglass_flowing_sand:`
        );
      }
    });
  }
  if (interaction.commandName === "cerrar") {
    const onu = interaction.options.getString("onu");
    postData("https://connectionseyt.net/TiemposCyS/actualizar", {
      ID: onu,
      Tecnico: interaction.user.globalName,
      fecha: now,
    }).then((data) => {
      if (data.msg == "se guardo") {
        interaction.reply(
          `ONU ${onu} activa \nMuy bien hecho! :rocket::rocket:`
        );
      }
    });
  }
  if (interaction.commandName === "planificacion") {
    var descripcion = interaction.options.getString("descripcion");
    await CrearFlokzu(interaction.user.globalName, now).then((data) => {
      if (data.status == "OK") {
        console.log(descripcion);
        interaction.reply(
          `Identificador de la planificacion: ${data.Id}.\n${descripcion}\n:rocket::rocket:`
        );
      }
    });
  }
  if (interaction.commandName === "asignados") {
    interaction.deferReply({ ephemeral: false });
    await asignadas("asignada a un tecnico").then((data) => {
      if (data != null) {
        for (let x of data) {
          mensaje = `ID ticket: ${x.id_flokzu}\nNombre cliente: ${x.nombre_cliente}\nTecnico: ${x.tecnico}\nServicio: ${x.Servicio}\nCuadrilla:\n`;
          var tecnicos = JSON.parse(x.Cuadrilla);
          if (tecnicos != null) {
            for (let tecnico of tecnicos) {
              mensaje = mensaje + tecnico + "\n";
            }
          }
          interaction.followUp({ content: mensaje });
        }
      } else {
        interaction.followUp({
          content: "No hay nada asignado :rocket::rocket:",
        });
      }
    });

    //interaction.reply(mensaje);
  }
  if (interaction.commandName === "devueltas") {
    interaction.deferReply({ ephemeral: false });
    await asignadas("No completado").then((data) => {
      if (data != null) {
        for (let x of data) {
          mensaje = `ID ticket: ${x.id_flokzu}\nNombre cliente: ${x.nombre_cliente}\nTecnico: ${x.tecnico}\nServicio: ${x.Servicio}\nCuadrilla:\n`;
          var tecnicos = JSON.parse(x.Cuadrilla);
          if (tecnicos != null) {
            for (let tecnico of tecnicos) {
              mensaje = mensaje + tecnico + "\n";
            }
          }
          interaction.followUp({ content: mensaje });
        }
      } else {
        interaction.followUp({
          content: "No hay nada devuelto actualmente :rocket::rocket:",
        });
      }
    });
  }
  if (interaction.commandName === "fecha") {
    interaction.deferReply({ ephemeral: false });
    await fecha(interaction.options.getString("fecha")).then((data) => {
      if (data != null) {
        for (let x of data) {
          mensaje = `ID ticket: ${x.id_flokzu}\nNombre cliente: ${x.nombre_cliente}\nEstado: ${x.estado}\nServicio: ${x.servicio}\nTecnico: ${x.tecnico}\nServicio: ${x.Servicio}\nCuadrilla:\n`;
          var tecnicos = JSON.parse(x.Cuadrilla);
          if (tecnicos != null) {
            for (let tecnico of tecnicos) {
              mensaje = mensaje + tecnico + "\n";
            }
          }
          interaction.followUp({ content: mensaje });
        }
      } else {
        interaction.followUp({
          content: "No hay registros en esta fecha :person_shrugging:",
        });
      }
    });
  }
  if (interaction.commandName === "promedio") {
    await promedio().then((data) => {
      let tiempo_Fibra = `Tiempo aproximado en Fibra Optica es de ${Math.floor(
        data["Tiempo En fibra"]
      )} Dias con ${Math.floor((data["Tiempo En fibra"] % 1) * 24)} Horas`;
      let tiempo_Antena = `Tiempo aproximado en Antena es de ${Math.floor(
        data["Tiempo En wireless"]
      )} Dias con ${Math.floor((data["Tiempo En wireless"] % 1) * 24)} Horas`;

      mensaje = `${tiempo_Fibra}\n${tiempo_Antena}\nTotal de muestras en Fibra Optica: ${data["Total casos de fibra"]}\nTotal de muestras en Antena ${data["Total casos de wireless"]}`;
      interaction.reply(mensaje);
    });
  }
  if (interaction.commandName === "filtrar") {
    interaction.deferReply({ ephemeral: false });
    let cedula = interaction.options.getString("cedula");
    await obtenerCliente(cedula).then((data) => {
      let arr = data["results"];
      Object.values(arr).forEach((val) => {
        let mensaje = `ID del servicio: ${val["id_servicio"]}\nNombre: ${val["nombre"]}\nEstado: ${val["estado"]}\nDireccion: ${val["direccion"]}\nSaldo: ${val["saldo"]}`;
        interaction.followUp({ content: mensaje });
      });
    });
  }
  if (interaction.commandName === "activarservicio") {
    let id = interaction.options.getString("id");
    let mensaje = "";
    await activarCliente(id).then((data) => {
      if(data["warnings"].length == 0){
        mensaje = `${interaction.user.globalName}: Se activo el servicio con el id ${id}`;
      }
      else{
        mensaje = `${interaction.user.globalName}: No se pudo activar o no se encontro el servicio con el id ${id}`;
      }
      interaction.reply(mensaje);
    });
  }
  if (interaction.commandName === "desactivarservicio") {
    let id = interaction.options.getString("id");
    let mensaje = "";
    await desactivarCliente(id).then((data) => {
      if(data["warnings"].length == 0){
        mensaje = `${interaction.user.globalName}: Se desactivo el servicio con el id ${id}`;
      }
      else{
        mensaje = `${interaction.user.globalName}: No se pudo desactivar o no se encontro el servicio con el id ${id}`;
      }
      interaction.reply(mensaje);
    });
  }
  if (interaction.commandName === "registros") {
    interaction.deferReply({ ephemeral: false });
    let tecnico = interaction.options.getString("tecnico");
    let fecha = interaction.options.getString("fecha");;
    await registros(tecnico, fecha).then((data) => {
      if (data != null) {
        for (let x of data) {
          console.log(x)
          mensaje = `ID ticket: ${x.id}\nEstado: ${x.estado}\n`;
          interaction.followUp({ content: mensaje });
        }
      } else {
        interaction.followUp({
          content: "No hay registros :person_shrugging:",
        });
      }
    });
  }
  if (interaction.commandName === "cancelar") {
    await EditarFlokzu(interaction.options.getString("id")).then((data) => {
      console.log(data);
      if (data.status == "OK") {
        interaction.reply(
          `Se cancelo la planificacoin: ${interaction.options.getString(
            "id"
          )}.\n :x::x:`
        );
      }
    });
  }
  if (interaction.commandName === "ayuda") {
    interaction.reply(
      "/ping =======================> Indica si el bot esta activo\n/activar [cliente][router][ONU] => lanza una peticion para que activen un cliente\n/cerrar [ONU] ===============> cierra la peticion de activacion\n/planificacion [descripcion] ===> guarda un registro de la planificacion\n/asignados ========> Muestra una lista de los trabajos asignados a los tecnicos.\n/devueltas => muestra una lista de las tareas marcados como no completada por los tecnicos\n/fecha [dd-mm-yyyy] Muesta una lista de actividades que coincidan con la fecha indicada\n/cancelar [id] => permite eliminar un registro de planificacion"
    );
  }
});
client.login(token);

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json; // parses JSON response into native JavaScript objects
}

async function CrearFlokzu(tecnico) {
  const response = await fetch(
    "https://app.flokzu.com/flokzuopenapi/api/v2/database/record",
    {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "9e4e750046c0d1bee31dcbea46d9a5502a4900cd3f829992",
        "X-Username": "soporteinterno@connectioneyt.com",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        databaseName: "Histórico de planificaciones",
        data: {
          Agente: tecnico,
          Fecha: now,
          estado: "valido",
        },
      }), // body data type must match "Content-Type" header
    }
  );
  return response.json(); // parses JSON response into native JavaScript objects
}

async function EditarFlokzu(id) {
  const response = await fetch(
    "https://app.flokzu.com/flokzuopenapi/api/v2/database/record",
    {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "9e4e750046c0d1bee31dcbea46d9a5502a4900cd3f829992",
        "X-Username": "soporteinterno@connectioneyt.com",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        databaseName: "Histórico de planificaciones",
        withInsert: false,
        data: {
          Id: id,
          estado: "invalido",
        },
      }), // body data type must match "Content-Type" header
    }
  );
  return response.json(); // parses JSON response into native JavaScript objects
}

async function asignadas(estado) {
  const response = await fetch(
    `https://connectionseyt.net/SeguimientoCasos/listarCasos.php?estado=${estado}`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
    }
  );
  return response.json(); // parses JSON response into native JavaScript objects
}

async function fecha(fecha) {
  const response = await fetch(
    `https://connectionseyt.net/SeguimientoCasos/listarCasos.php?fecha=${fecha}`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
    }
  );
  return response.json(); // parses JSON response into native JavaScript objects
}

async function promedio() {
  const response = await fetch(`https://connectionseyt.net/flokzu/Promedio`, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer",
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function obtenerCliente(cedula) {
  const response = await fetch(
    `https://api.wisphub.io/api/clientes?cedula__contains=${cedula}`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Api-Key M9XZ4VXG.DGCvHp4Bt5oeOodYiBGn9Cl3DuWQbaDo",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer",
    }
  );
  return response.json(); // parses JSON response into native JavaScript objects
}
async function activarCliente(id) {
  const response = await fetch(`https://api.wisphub.io/api/clientes/activar/`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Api-Key M9XZ4VXG.DGCvHp4Bt5oeOodYiBGn9Cl3DuWQbaDo",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      servicios: [id],
    }),
  });
  return response.json();
}
async function desactivarCliente(id)
{
  const response = await fetch(`https://api.wisphub.io/api/clientes/desactivar/`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Api-Key M9XZ4VXG.DGCvHp4Bt5oeOodYiBGn9Cl3DuWQbaDo",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      servicios: [id],
    }),
  });
  return response.json();
}
async function registros(tecnico, fecha) {
  const response = await fetch(`http://localhost/ceyt/buscarTareas.php?tecnico=${tecnico}&fecha=${fecha}`, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer"
  });
  return response.json();
}