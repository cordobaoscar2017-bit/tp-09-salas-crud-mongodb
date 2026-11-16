const express = require("express");

function crearRouterApiReservas(controlador, validadores) {
  const router = express.Router();

  // Consultar todas las reservas.
  router.get("/", controlador.listar);

  // Consultar una reserva por su identificador.
  router.get("/:id", controlador.detalle);

  // Crear una reserva.
  router.post("/", validadores.validarCrear, controlador.crear);

  // Reemplazar una reserva completa.
  router.put("/:id", validadores.validarReemplazo, controlador.reemplazar);

  // Modificar parcialmente una reserva.
  router.patch(
    "/:id",
    validadores.validarParcial,
    controlador.actualizarParcial,
  );

  // Eliminar una reserva.
  router.delete("/:id", controlador.eliminar);

  return router;
}

module.exports = { crearRouterApiReservas };
