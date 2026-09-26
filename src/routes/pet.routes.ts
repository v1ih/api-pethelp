import { Router } from "express";
import { petController } from "../controllers/pet.controller";
import { validate } from "../middlewares/validate";
import { petSchema } from "../schemas/pet.schema";
import { idParamSchema } from "../schemas/common.schema";

export const petRoutes = Router();

petRoutes.get("/", petController.listar);
petRoutes.get("/:id", validate(idParamSchema, "params"), petController.buscarPorId);
petRoutes.post("/", validate(petSchema), petController.criar);
petRoutes.put("/:id", validate(idParamSchema, "params"), validate(petSchema), petController.atualizar);
petRoutes.delete("/:id", validate(idParamSchema, "params"), petController.remover);
