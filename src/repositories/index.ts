import { MemoryRepository } from "./memory.repository";
import type { Tutor } from "../schemas/tutor.schema";
import type { Pet } from "../schemas/pet.schema";
import type { Consulta } from "../schemas/consulta.schema";

export const tutorRepository = new MemoryRepository<Tutor>();
export const petRepository = new MemoryRepository<Pet>();
export const consultaRepository = new MemoryRepository<Consulta>();
