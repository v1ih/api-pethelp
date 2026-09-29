# PetHelp API

API REST de uma clínica veterinária, desenvolvida em **Node.js + TypeScript** com validação de schemas usando **Zod**.

Trabalho da disciplina **Laboratório de Desenvolvimento Mobile II**.

## Tecnologias

- Node.js + TypeScript
- Express 5 (servidor HTTP e rotas)
- Zod (validação dos dados de entrada)
- Swagger UI (documentação interativa)
- tsx (roda o TypeScript direto em desenvolvimento)

## Como rodar

```bash
npm install
npm run dev
```

A API sobe em `http://localhost:3333`.

Para gerar a versão compilada: `npm run build` e depois `npm start`.

> Os dados ficam em memória: ao reiniciar o servidor, tudo é apagado.

## Documentação (Swagger)

Com a API rodando, acesse **http://localhost:3333/docs** (ou só `http://localhost:3333`, que redireciona para lá).

Lá estão todos os endpoints, e dá para testar cada um pelo navegador: clique no endpoint → **Try it out** → edite o JSON → **Execute**. A documentação é gerada a partir dos próprios schemas do Zod (`src/docs/openapi.ts`).

## Recursos (3 CRUDs)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/responsaveis` | Lista todos os responsáveis |
| GET | `/responsaveis/:id` | Busca um responsável pelo id |
| POST | `/responsaveis` | Cadastra um responsável |
| PUT | `/responsaveis/:id` | Atualiza um responsável |
| DELETE | `/responsaveis/:id` | Remove um responsável |
| GET | `/pets` | Lista todos os pets |
| GET | `/pets/:id` | Busca um pet pelo id |
| POST | `/pets` | Cadastra um pet |
| PUT | `/pets/:id` | Atualiza um pet |
| DELETE | `/pets/:id` | Remove um pet |
| GET | `/consultas` | Lista todas as consultas |
| GET | `/consultas/:id` | Busca uma consulta pelo id |
| POST | `/consultas` | Agenda uma consulta |
| PUT | `/consultas/:id` | Atualiza uma consulta |
| DELETE | `/consultas/:id` | Remove uma consulta |

### Exemplos de corpo (JSON)

**Responsável**
```json
{
  "nome": "Ana Souza",
  "email": "ana@email.com",
  "telefone": "(11) 91234-5678",
  "cpf": "123.456.789-00"
}
```

**Pet** (`responsavelId` precisa ser de um responsável existente)
```json
{
  "nome": "Rex",
  "especie": "cachorro",
  "raca": "Vira-lata",
  "idade": 3,
  "peso": 12.5,
  "responsavelId": "<id do responsável>"
}
```

**Consulta** (`petId` precisa ser de um pet existente)
```json
{
  "petId": "<id do pet>",
  "veterinario": "Dr. Carlos",
  "data": "2026-10-01T14:30:00Z",
  "motivo": "Vacina anual",
  "status": "agendada",
  "valor": 150
}
```

## Validação com Zod

Cada recurso tem um schema em `src/schemas/`. O middleware `validate` (`src/middlewares/validate.ts`) confere o corpo da requisição e o `:id` da URL **antes** de chegar no controller. Quando algo está errado, a API responde `400` com a lista de erros:

```json
{
  "mensagem": "Dados inválidos",
  "erros": [
    { "campo": "email", "mensagem": "E-mail inválido" },
    { "campo": "peso", "mensagem": "O peso deve ser maior que zero" }
  ]
}
```

## Regras de negócio

- Não é possível cadastrar dois responsáveis com o mesmo e-mail (`409`).
- Um pet só pode ser criado para um responsável existente, e uma consulta só para um pet existente (`404`).
- Não é possível remover um responsável que tem pets, nem um pet que tem consultas (`409`).

## Códigos de resposta

| Código | Quando |
|---|---|
| 200 | Sucesso (GET, PUT) |
| 201 | Registro criado (POST) |
| 204 | Registro removido (DELETE) |
| 400 | Dados inválidos (erro do Zod) ou JSON mal formatado |
| 404 | Registro não encontrado |
| 409 | Conflito (e-mail duplicado ou remoção bloqueada) |

## Estrutura

```
src/
├── server.ts            # sobe o servidor
├── app.ts               # configura o Express e registra as rotas
├── schemas/             # schemas do Zod (responsavel, pet, consulta, id)
├── middlewares/         # validação e tratamento de erros
├── routes/              # rotas de cada recurso
├── controllers/         # lógica de cada rota
└── repositories/        # armazenamento em memória
```

## Testando

O arquivo `requests.http` tem todas as requisições prontas. Ele funciona com a extensão **REST Client** do VS Code. Também dá para usar Postman ou Insomnia.
