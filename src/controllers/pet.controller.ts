import type { Request, Response } from "express";
import { petRepository, tutorRepository, consultaRepository } from "../repositories";
import type { PetInput } from "../schemas/pet.schema";

type IdParams = { id: string };

export const petController = {
  listar(_req: Request, res: Response) {
    res.json(petRepository.findAll());
  },

  buscarPorId(req: Request<IdParams>, res: Response) {
    const pet = petRepository.findById(req.params.id);
    if (!pet) return res.status(404).json({ mensagem: "Pet não encontrado" });
    res.json(pet);
  },

  criar(req: Request<{}, {}, PetInput>, res: Response) {
    if (!tutorRepository.findById(req.body.tutorId)) {
      return res.status(404).json({ mensagem: "Tutor informado não existe" });
    }
    res.status(201).json(petRepository.create(req.body));
  },

  atualizar(req: Request<IdParams, {}, PetInput>, res: Response) {
    if (!tutorRepository.findById(req.body.tutorId)) {
      return res.status(404).json({ mensagem: "Tutor informado não existe" });
    }
    const pet = petRepository.update(req.params.id, req.body);
    if (!pet) return res.status(404).json({ mensagem: "Pet não encontrado" });
    res.json(pet);
  },

  remover(req: Request<IdParams>, res: Response) {
    const temConsultas = consultaRepository.findAll().some((c) => c.petId === req.params.id);
    if (temConsultas) {
      return res.status(409).json({ mensagem: "Pet possui consultas cadastradas. Remova as consultas primeiro." });
    }
    if (!petRepository.delete(req.params.id)) {
      return res.status(404).json({ mensagem: "Pet não encontrado" });
    }
    res.status(204).send();
  },
};
