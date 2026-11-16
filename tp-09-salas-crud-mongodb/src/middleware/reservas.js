function crearValidadorReservas(salasPermitidas) {
  function validarReserva(req, res, next) {
    const cuerpo = req.body || {};

    const valores = {
      estudiante:
        typeof cuerpo.estudiante === "string" ? cuerpo.estudiante.trim() : "",
      email: typeof cuerpo.email === "string" ? cuerpo.email.trim() : "",
      sala: typeof cuerpo.sala === "string" ? cuerpo.sala.trim() : "",
      fecha: typeof cuerpo.fecha === "string" ? cuerpo.fecha.trim() : "",
      turno: typeof cuerpo.turno === "string" ? cuerpo.turno.trim() : "",
      personas:
        typeof cuerpo.personas === "string" ? cuerpo.personas.trim() : "",
    };

    const personasNumero = Number(valores.personas);

    const valido =
      valores.estudiante !== "" &&
      valores.email.includes("@") &&
      salasPermitidas.includes(valores.sala) &&
      valores.fecha !== "" &&
      ["Mañana", "Tarde", "Noche"].includes(valores.turno) &&
      valores.personas !== "" &&
      Number.isInteger(personasNumero) &&
      personasNumero >= 1 &&
      personasNumero <= 6;

    if (!valido) {
      return res.status(400).render("nueva", {
        titulo: "Nueva reserva",
        salas: salasPermitidas,
        valores,
        error:
          "Los datos ingresados no son válidos. Verificá todos los campos.",
      });
    }

    req.reservaValidada = {
      estudiante: valores.estudiante,
      email: valores.email,
      sala: valores.sala,
      fecha: valores.fecha,
      turno: valores.turno,
      personas: personasNumero,
    };

    next();
  }

  return validarReserva;
}

// Validadores exclusivos para la API JSON.
function crearValidadorApiReservas(salasPermitidas) {
  const camposPOST = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
  ];

  const camposPUT = [...camposPOST, "estado"];

  const camposPATCH = ["personas", "estado"];

  const turnosPermitidos = ["Mañana", "Tarde", "Noche"];
  const estadosPermitidos = ["pendiente", "confirmada"];

  function esObjetoValido(cuerpo) {
    return (
      cuerpo !== null && typeof cuerpo === "object" && !Array.isArray(cuerpo)
    );
  }

  function contieneCamposPermitidos(cuerpo, camposPermitidos) {
    return Object.keys(cuerpo).every((campo) =>
      camposPermitidos.includes(campo),
    );
  }

  function validarPersonas(valor) {
    if (typeof valor !== "number" && typeof valor !== "string") {
      return null;
    }

    if (typeof valor === "string" && valor.trim() === "") {
      return null;
    }

    const numero = Number(valor);

    if (
      !Number.isFinite(numero) ||
      !Number.isInteger(numero) ||
      numero < 1 ||
      numero > 6
    ) {
      return null;
    }

    return numero;
  }

  function validarDatosComunes(cuerpo) {
    const estudiante =
      typeof cuerpo.estudiante === "string" ? cuerpo.estudiante.trim() : "";

    const email = typeof cuerpo.email === "string" ? cuerpo.email.trim() : "";

    const sala = typeof cuerpo.sala === "string" ? cuerpo.sala.trim() : "";

    const fecha = typeof cuerpo.fecha === "string" ? cuerpo.fecha.trim() : "";

    const turno = typeof cuerpo.turno === "string" ? cuerpo.turno.trim() : "";

    const personas = validarPersonas(cuerpo.personas);

    if (
      estudiante === "" ||
      email === "" ||
      !email.includes("@") ||
      !salasPermitidas.includes(sala) ||
      fecha === "" ||
      !turnosPermitidos.includes(turno) ||
      personas === null
    ) {
      return null;
    }

    return {
      estudiante,
      email,
      sala,
      fecha,
      turno,
      personas,
    };
  }

  function validarCrear(req, res, next) {
    const cuerpo = req.body;

    if (
      !esObjetoValido(cuerpo) ||
      !contieneCamposPermitidos(cuerpo, camposPOST)
    ) {
      return res.status(400).json({
        error:
          "El cuerpo debe ser un objeto JSON con los campos permitidos para crear una reserva.",
      });
    }

    const datos = validarDatosComunes(cuerpo);

    if (!datos || !camposPOST.every((campo) => Object.hasOwn(cuerpo, campo))) {
      return res.status(400).json({
        error: "Los datos de la reserva no son válidos.",
      });
    }

    req.reservaValidada = datos;
    next();
  }

  function validarReemplazo(req, res, next) {
    const cuerpo = req.body;

    if (
      !esObjetoValido(cuerpo) ||
      !contieneCamposPermitidos(cuerpo, camposPUT) ||
      !camposPUT.every((campo) => Object.hasOwn(cuerpo, campo))
    ) {
      return res.status(400).json({
        error:
          "PUT requiere todos los campos de la reserva y no admite campos adicionales.",
      });
    }

    const datos = validarDatosComunes(cuerpo);

    if (
      !datos ||
      !estadosPermitidos.includes(
        typeof cuerpo.estado === "string" ? cuerpo.estado.trim() : "",
      )
    ) {
      return res.status(400).json({
        error: "Los datos enviados para reemplazar la reserva no son válidos.",
      });
    }

    datos.estado = cuerpo.estado.trim();

    req.reservaValidada = datos;
    next();
  }

  function validarParcial(req, res, next) {
    const cuerpo = req.body;

    if (
      !esObjetoValido(cuerpo) ||
      Object.keys(cuerpo).length === 0 ||
      !contieneCamposPermitidos(cuerpo, camposPATCH)
    ) {
      return res.status(400).json({
        error: "PATCH requiere al menos un campo permitido: personas o estado.",
      });
    }

    const datos = {};

    if (Object.hasOwn(cuerpo, "personas")) {
      const personas = validarPersonas(cuerpo.personas);

      if (personas === null) {
        return res.status(400).json({
          error:
            "La cantidad de personas debe ser un número entero entre 1 y 6.",
        });
      }

      datos.personas = personas;
    }

    if (Object.hasOwn(cuerpo, "estado")) {
      const estado =
        typeof cuerpo.estado === "string" ? cuerpo.estado.trim() : "";

      if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({
          error: "El estado debe ser pendiente o confirmada.",
        });
      }

      datos.estado = estado;
    }

    req.reservaValidada = datos;
    next();
  }

  return {
    validarCrear,
    validarReemplazo,
    validarParcial,
  };
}

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

module.exports = {
  crearValidadorReservas,
  crearValidadorApiReservas,
  prepararAreaReservas,
};
