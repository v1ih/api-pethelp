import { Router } from "express";
import { consultaController } from "../controllers/consulta.controller";
import { validate } from "../middlewares/validate";
import { consultaSchema } from "../schemas/consulta.schema";
import { idParamSchema } from "../schemas/common.schema";

export const consultaRoutes = Router();

consultaRoutes.get("/", consultaController.listar);
consultaRoutes.get("/:id", validate(idParamSchema, "params"), consultaController.buscarPorId);
consultaRoutes.post("/", validate(consultaSchema), consultaController.criar);
consultaRoutes.put("/:id", validate(idParamSchema, "params"), validate(consultaSchema), consultaController.atualizar);
consultaRoutes.delete("/:id", validate(idParamSchema, "params"), consultaController.remover);
