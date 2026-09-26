import { Router } from "express";
import { responsavelController } from "../controllers/responsavel.controller";
import { validate } from "../middlewares/validate";
import { responsavelSchema } from "../schemas/responsavel.schema";
import { idParamSchema } from "../schemas/common.schema";

export const responsavelRoutes = Router();

responsavelRoutes.get("/", responsavelController.listar);
responsavelRoutes.get("/:id", validate(idParamSchema, "params"), responsavelController.buscarPorId);
responsavelRoutes.post("/", validate(responsavelSchema), responsavelController.criar);
responsavelRoutes.put("/:id", validate(idParamSchema, "params"), validate(responsavelSchema), responsavelController.atualizar);
responsavelRoutes.delete("/:id", validate(idParamSchema, "params"), responsavelController.remover);
