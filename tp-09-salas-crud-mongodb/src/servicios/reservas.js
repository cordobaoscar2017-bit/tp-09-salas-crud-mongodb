const Reserva = require("../modelos/reservas");

function crearServicioReservas() {
  const camposPUT = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
    "estado",
  ];

  const camposPATCH = ["personas", "estado"];

  function seleccionarCampos(datos, camposPermitidos) {
    const resultado = {};

    for (const campo of camposPermitidos) {
      if (Object.hasOwn(datos, campo)) {
        resultado[campo] = datos[campo];
      }
    }

    return resultado;
  }

  async function listar(filtro = {}) {
    return await Reserva.find(filtro).lean();
  }

  async function buscarPorId(id) {
    return await Reserva.findById(id).lean();
  }

  async function contar() {
    return await Reserva.countDocuments();
  }

  async function crear(datos) {
    const nuevaReserva = await Reserva.create(datos);

    return nuevaReserva.toObject();
  }

  // PUT: reemplazo completo de los campos editables.
  async function reemplazar(id, datos) {
    const datosPermitidos = seleccionarCampos(datos, camposPUT);

    const reservaActualizada = await Reserva.findByIdAndUpdate(
      id,
      { $set: datosPermitidos },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );

    return reservaActualizada;
  }

  // PATCH: actualización parcial de personas y estado.
  async function actualizarParcial(id, datos) {
    const datosPermitidos = seleccionarCampos(datos, camposPATCH);

    const reservaActualizada = await Reserva.findByIdAndUpdate(
      id,
      { $set: datosPermitidos },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );

    return reservaActualizada;
  }

  // DELETE: eliminación física de una reserva.
  async function eliminar(id) {
    return await Reserva.findByIdAndDelete(id);
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
    reemplazar,
    actualizarParcial,
    eliminar,
  };
}

module.exports = { crearServicioReservas };
