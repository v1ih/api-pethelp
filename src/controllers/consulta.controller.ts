import type { Request, Response } from "express";
import { consultaRepository, petRepository } from "../repositories";
import type { ConsultaInput } from "../schemas/consulta.schema";

type IdParams = { id: string };

export const consultaController = {
  listar(_req: Request, res: Response) {
    res.json(consultaRepository.findAll());
  },

  buscarPorId(req: Request<IdParams>, res: Response) {
    const consulta = consultaRepository.findById(req.params.id);
    if (!consulta) return res.status(404).json({ mensagem: "Consulta não encontrada" });
    res.json(consulta);
  },

  criar(req: Request<{}, {}, ConsultaInput>, res: Response) {
    if (!petRepository.findById(req.body.petId)) {
      return res.status(404).json({ mensagem: "Pet informado não existe" });
    }
    res.status(201).json(consultaRepository.create(req.body));
  },

  atualizar(req: Request<IdParams, {}, ConsultaInput>, res: Response) {
    if (!petRepository.findById(req.body.petId)) {
      return res.status(404).json({ mensagem: "Pet informado não existe" });
    }
    const consulta = consultaRepository.update(req.params.id, req.body);
    if (!consulta) return res.status(404).json({ mensagem: "Consulta não encontrada" });
    res.json(consulta);
  },

  remover(req: Request<IdParams>, res: Response) {
    if (!consultaRepository.delete(req.params.id)) {
      return res.status(404).json({ mensagem: "Consulta não encontrada" });
    }
    res.status(204).send();
  },
};
