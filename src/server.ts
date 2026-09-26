import { app } from "./app";

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`PetHelp API rodando em http://localhost:${PORT}`);
});
