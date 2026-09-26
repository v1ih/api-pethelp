import { z } from "zod";

export const petSchema = z.object({
  nome: z.string().trim().min(1, "O nome do pet é obrigatório"),
  especie: z.enum(["cachorro", "gato", "passaro", "roedor", "outro"], {
    error: "Espécie deve ser: cachorro, gato, passaro, roedor ou outro",
  }),
  raca: z.string().trim().optional(),
  idade: z.number().int("A idade deve ser um número inteiro").min(0, "A idade não pode ser negativa").max(40, "Idade máxima: 40 anos"),
  peso: z.number().positive("O peso deve ser maior que zero"),
  responsavelId: z.uuid("responsavelId deve ser um UUID válido"),
});

export type PetInput = z.infer<typeof petSchema>;
export type Pet = PetInput & { id: string };
