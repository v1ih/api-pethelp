import express from "express";
import swaggerUi from "swagger-ui-express";
import { responsavelRoutes } from "./routes/responsavel.routes";
import { petRoutes } from "./routes/pet.routes";
import { consultaRoutes } from "./routes/consulta.routes";
import { errorHandler, notFound } from "./middlewares/error-handler";
import { openApiDocument } from "./docs/openapi";

export const app = express();

app.use(express.json());

// Documentação interativa (Swagger) em http://localhost:3333/docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument, { customSiteTitle: "PetHelp API" }));

app.get("/", (_req, res) => {
  res.redirect("/docs");
});

app.use("/responsaveis", responsavelRoutes);
app.use("/pets", petRoutes);
app.use("/consultas", consultaRoutes);

app.use(notFound);
app.use(errorHandler);
