import express from "express";
import { responsavelRoutes } from "./routes/responsavel.routes";
import { petRoutes } from "./routes/pet.routes";
import { consultaRoutes } from "./routes/consulta.routes";
import { errorHandler, notFound } from "./middlewares/error-handler";

export const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    api: "PetHelp API",
    recursos: ["/responsaveis", "/pets", "/consultas"],
  });
});

app.use("/responsaveis", responsavelRoutes);
app.use("/pets", petRoutes);
app.use("/consultas", consultaRoutes);

app.use(notFound);
app.use(errorHandler);
