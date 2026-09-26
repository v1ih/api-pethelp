import type { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ mensagem: `Rota ${req.method} ${req.originalUrl} não encontrada` });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ mensagem: "JSON mal formatado no corpo da requisição" });
  }
  console.error(err);
  res.status(500).json({ mensagem: "Erro interno do servidor" });
}
