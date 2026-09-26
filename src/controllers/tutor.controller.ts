import type { Request, Response } from "express";
import { tutorRepository, petRepository } from "../repositories";
import type { TutorInput } from "../schemas/tutor.schema";

type IdParams = { id: string };

export const tutorController = {
  listar(_req: Request, res: Response) {
    res.json(tutorRepository.findAll());
  },

  buscarPorId(req: Request<IdParams>, res: Response) {
    const tutor = tutorRepository.findById(req.params.id);
    if (!tutor) return res.status(404).json({ mensagem: "Tutor não encontrado" });
    res.json(tutor);
  },

  criar(req: Request<{}, {}, TutorInput>, res: Response) {
    const emailEmUso = tutorRepository.findAll().some((t) => t.email === req.body.email);
    if (emailEmUso) return res.status(409).json({ mensagem: "Já existe um tutor com esse e-mail" });
    res.status(201).json(tutorRepository.create(req.body));
  },

  atualizar(req: Request<IdParams, {}, TutorInput>, res: Response) {
    const emailEmUso = tutorRepository
      .findAll()
      .some((t) => t.email === req.body.email && t.id !== req.params.id);
    if (emailEmUso) return res.status(409).json({ mensagem: "Já existe um tutor com esse e-mail" });

    const tutor = tutorRepository.update(req.params.id, req.body);
    if (!tutor) return res.status(404).json({ mensagem: "Tutor não encontrado" });
    res.json(tutor);
  },

  remover(req: Request<IdParams>, res: Response) {
    const temPets = petRepository.findAll().some((p) => p.tutorId === req.params.id);
    if (temPets) {
      return res.status(409).json({ mensagem: "Tutor possui pets cadastrados. Remova os pets primeiro." });
    }
    if (!tutorRepository.delete(req.params.id)) {
      return res.status(404).json({ mensagem: "Tutor não encontrado" });
    }
    res.status(204).send();
  },
};
