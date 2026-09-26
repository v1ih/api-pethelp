import { MemoryRepository } from "./memory.repository";
import type { Responsavel } from "../schemas/responsavel.schema";
import type { Pet } from "../schemas/pet.schema";
import type { Consulta } from "../schemas/consulta.schema";

export const responsavelRepository = new MemoryRepository<Responsavel>();
export const petRepository = new MemoryRepository<Pet>();
export const consultaRepository = new MemoryRepository<Consulta>();
