import { z, type ZodType } from "zod";
import { responsavelSchema } from "../schemas/responsavel.schema";
import { petSchema } from "../schemas/pet.schema";
import { consultaSchema } from "../schemas/consulta.schema";

// Converte um schema do Zod em JSON Schema, que é o formato que o Swagger entende
function toSchema(schema: ZodType) {
  const { $schema, ...jsonSchema } = z.toJSONSchema(schema, { io: "input" }) as Record<string, unknown>;
  return jsonSchema;
}

const idParam = {
  name: "id",
  in: "path",
  required: true,
  description: "UUID do registro",
  schema: { type: "string", format: "uuid" },
};

const erroValidacao = {
  description: "Dados inválidos (erro do Zod)",
  content: { "application/json": { schema: { $ref: "#/components/schemas/ErroValidacao" } } },
};

const erroMensagem = (description: string) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Mensagem" } } },
});

// Gera as 5 rotas (GET, GET/:id, POST, PUT, DELETE) de um recurso
type Nome = { singular: string; plural: string; artigo: string; todos: string };

function crud(tag: string, rota: string, nome: Nome, exemplo: object, extras: Record<string, object> = {}) {
  const ref = { $ref: `#/components/schemas/${tag}` };
  const refInput = { $ref: `#/components/schemas/${tag}Input` };
  const corpo = { required: true, content: { "application/json": { schema: refInput, example: exemplo } } };
  const ok = (description: string, schema: object) => ({
    description,
    content: { "application/json": { schema } },
  });

  return {
    [rota]: {
      get: {
        tags: [tag],
        summary: `Lista ${nome.todos} ${nome.plural}`,
        responses: { 200: ok("Lista retornada", { type: "array", items: ref }) },
      },
      post: {
        tags: [tag],
        summary: `Cadastra ${nome.artigo} ${nome.singular}`,
        requestBody: corpo,
        responses: { 201: ok("Registro criado", ref), 400: erroValidacao, ...extras.post },
      },
    },
    [`${rota}/{id}`]: {
      parameters: [idParam],
      get: {
        tags: [tag],
        summary: `Busca ${nome.artigo} ${nome.singular} pelo id`,
        responses: { 200: ok("Registro encontrado", ref), 400: erroValidacao, 404: erroMensagem("Não encontrado") },
      },
      put: {
        tags: [tag],
        summary: `Atualiza ${nome.artigo} ${nome.singular}`,
        requestBody: corpo,
        responses: {
          200: ok("Registro atualizado", ref),
          400: erroValidacao,
          404: erroMensagem("Não encontrado"),
          ...extras.put,
        },
      },
      delete: {
        tags: [tag],
        summary: `Remove ${nome.artigo} ${nome.singular}`,
        responses: { 204: { description: "Registro removido" }, 404: erroMensagem("Não encontrado"), ...extras.delete },
      },
    },
  };
}

// O registro salvo é o mesmo schema de entrada com o campo id na frente
function comId(schema: ZodType) {
  const base = toSchema(schema) as { properties: object; required?: string[] };
  return {
    ...base,
    properties: { id: { type: "string", format: "uuid" }, ...base.properties },
    required: ["id", ...(base.required ?? [])],
  };
}

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "PetHelp API",
    version: "1.0.0",
    description:
      "API REST de uma clínica veterinária feita com Node.js, TypeScript e Zod.\n\n" +
      "**Ordem para testar:** crie um responsável → copie o `id` → crie um pet com esse `responsavelId` → " +
      "copie o `id` do pet → crie uma consulta com esse `petId`.",
  },
  servers: [{ url: "/" }],
  tags: [
    { name: "Responsaveis", description: "Responsáveis pelos animais" },
    { name: "Pets", description: "Animais de cada responsável" },
    { name: "Consultas", description: "Consultas agendadas para cada pet" },
  ],
  paths: {
    ...crud(
      "Responsaveis",
      "/responsaveis",
      { singular: "responsável", plural: "responsáveis", artigo: "um", todos: "todos os" },
      { nome: "Ana Souza", email: "ana@email.com", telefone: "(11) 91234-5678", cpf: "123.456.789-00" },
      {
        post: { 409: erroMensagem("Já existe um responsável com esse e-mail") },
        put: { 409: erroMensagem("Já existe um responsável com esse e-mail") },
        delete: { 409: erroMensagem("Responsável possui pets cadastrados") },
      },
    ),
    ...crud(
      "Pets",
      "/pets",
      { singular: "pet", plural: "pets", artigo: "um", todos: "todos os" },
      {
        nome: "Rex",
        especie: "cachorro",
        raca: "Vira-lata",
        idade: 3,
        peso: 12.5,
        responsavelId: "cole-aqui-o-id-do-responsavel",
      },
      {
        post: { 404: erroMensagem("Responsável informado não existe") },
        put: { 404: erroMensagem("Pet ou responsável não encontrado") },
        delete: { 409: erroMensagem("Pet possui consultas cadastradas") },
      },
    ),
    ...crud(
      "Consultas",
      "/consultas",
      { singular: "consulta", plural: "consultas", artigo: "uma", todos: "todas as" },
      {
        petId: "cole-aqui-o-id-do-pet",
        veterinario: "Dr. Carlos",
        data: "2026-10-01T14:30:00Z",
        motivo: "Vacina anual",
        status: "agendada",
        valor: 150,
      },
      {
        post: { 404: erroMensagem("Pet informado não existe") },
        put: { 404: erroMensagem("Consulta ou pet não encontrado") },
      },
    ),
  },
  components: {
    schemas: {
      ResponsaveisInput: toSchema(responsavelSchema),
      PetsInput: toSchema(petSchema),
      ConsultasInput: toSchema(consultaSchema),
      Responsaveis: comId(responsavelSchema),
      Pets: comId(petSchema),
      Consultas: comId(consultaSchema),
      Mensagem: { type: "object", properties: { mensagem: { type: "string" } } },
      ErroValidacao: {
        type: "object",
        properties: {
          mensagem: { type: "string", example: "Dados inválidos" },
          erros: {
            type: "array",
            items: {
              type: "object",
              properties: { campo: { type: "string" }, mensagem: { type: "string" } },
            },
          },
        },
      },
    },
  },
};
