import { Router } from "express";
import { tutorController } from "../controllers/tutor.controller";
import { validate } from "../middlewares/validate";
import { tutorSchema } from "../schemas/tutor.schema";
import { idParamSchema } from "../schemas/common.schema";

export const tutorRoutes = Router();

tutorRoutes.get("/", tutorController.listar);
tutorRoutes.get("/:id", validate(idParamSchema, "params"), tutorController.buscarPorId);
tutorRoutes.post("/", validate(tutorSchema), tutorController.criar);
tutorRoutes.put("/:id", validate(idParamSchema, "params"), validate(tutorSchema), tutorController.atualizar);
tutorRoutes.delete("/:id", validate(idParamSchema, "params"), tutorController.remover);
