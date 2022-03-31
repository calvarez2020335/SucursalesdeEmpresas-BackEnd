const Empleados = require("../models/empleados.model");

function agregarEmpleado(req, res) {
  const parametros = req.body;
  const modeloEmpleados = new Empleados();

  if (
    parametros.nombre &&
    parametros.apellido &&
    parametros.puesto &&
    parametros.departamento
  ) {
    modeloEmpleados.nombre = parametros.nombre;
    modeloEmpleados.apellido = parametros.apellido;
    modeloEmpleados.puesto = parametros.puesto;
    modeloEmpleados.departamento = parametros.departamento;
    modeloEmpleados.idEmpresa = req.user.sub;

    modeloEmpleados.save((err, empleadoGuardado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (!empleadoGuardado)
        return res
          .status(500)
          .send({ mensaje: "Error al agregar el empleado" });

      return res.status(200).send({ empleado: empleadoGuardado });
    });
  } else {
    return res
      .status(400)
      .send({ mensaje: "Debe enviar los parametros solicitados" });
  }
}

module.exports = {
    agregarEmpleado
}