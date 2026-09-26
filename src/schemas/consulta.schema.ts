import { z } from "zod";

export const consultaSchema = z.object({
  petId: z.uuid("petId deve ser um UUID válido"),
  veterinario: z.string().trim().min(3, "Informe o nome do veterinário"),
  data: z.iso.datetime({ message: "Data inválida. Use o formato ISO, ex.: 2026-10-01T14:30:00Z" }),
  motivo: z.string().trim().min(5, "Descreva o motivo com pelo menos 5 caracteres"),
  status: z.enum(["agendada", "realizada", "cancelada"]).default("agendada"),
  valor: z.number().nonnegative("O valor não pode ser negativo"),
});

export type ConsultaInput = z.infer<typeof consultaSchema>;
export type Consulta = ConsultaInput & { id: string };
