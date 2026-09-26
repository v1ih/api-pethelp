import { z } from "zod";

export const responsavelSchema = z.object({
  nome: z.string().trim().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.email("E-mail inválido"),
  telefone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, "Telefone inválido. Ex.: (11) 91234-5678"),
  cpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido. Ex.: 123.456.789-00"),
});

export type ResponsavelInput = z.infer<typeof responsavelSchema>;
export type Responsavel = ResponsavelInput & { id: string };
