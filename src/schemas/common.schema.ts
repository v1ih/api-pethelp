import { z } from "zod";

// Valida o parâmetro :id das rotas (GET/:id, PUT/:id, DELETE/:id)
export const idParamSchema = z.object({
  id: z.uuid("O id deve ser um UUID válido"),
});
