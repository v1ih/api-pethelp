import type { Request, Response } from "express";
import { responsavelRepository, petRepository } from "../repositories";
import type { ResponsavelInput } from "../schemas/responsavel.schema";

type IdParams = { id: string };

export const responsavelController = {
  listar(_req: Request, res: Response) {
    res.json(responsavelRepository.findAll());
  },

  buscarPorId(req: Request<IdParams>, res: Response) {
    const responsavel = responsavelRepository.findById(req.params.id);
    if (!responsavel) return res.status(404).json({ mensagem: "Responsável não encontrado" });
    res.json(responsavel);
  },

  criar(req: Request<{}, {}, ResponsavelInput>, res: Response) {
    const emailEmUso = responsavelRepository.findAll().some((r) => r.email === req.body.email);
    if (emailEmUso) return res.status(409).json({ mensagem: "Já existe um responsável com esse e-mail" });
    res.status(201).json(responsavelRepository.create(req.body));
  },

  atualizar(req: Request<IdParams, {}, ResponsavelInput>, res: Response) {
    const emailEmUso = responsavelRepository
      .findAll()
      .some((r) => r.email === req.body.email && r.id !== req.params.id);
    if (emailEmUso) return res.status(409).json({ mensagem: "Já existe um responsável com esse e-mail" });

    const responsavel = responsavelRepository.update(req.params.id, req.body);
    if (!responsavel) return res.status(404).json({ mensagem: "Responsável não encontrado" });
    res.json(responsavel);
  },

  remover(req: Request<IdParams>, res: Response) {
    const temPets = petRepository.findAll().some((p) => p.responsavelId === req.params.id);
    if (temPets) {
      return res.status(409).json({ mensagem: "Responsável possui pets cadastrados. Remova os pets primeiro." });
    }
    if (!responsavelRepository.delete(req.params.id)) {
      return res.status(404).json({ mensagem: "Responsável não encontrado" });
    }
    res.status(204).send();
  },
};
