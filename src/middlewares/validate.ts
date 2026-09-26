import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

// Valida req.body ou req.params com um schema do Zod antes de chegar no controller
export function validate(schema: ZodType, source: "body" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        mensagem: "Dados inválidos",
        erros: result.error.issues.map((issue) => ({
          campo: issue.path.join("."),
          mensagem: issue.message,
        })),
      });
    }

    if (source === "body") req.body = result.data;
    next();
  };
}
