import express from "express";
import { tutorRoutes } from "./routes/tutor.routes";
import { petRoutes } from "./routes/pet.routes";
import { consultaRoutes } from "./routes/consulta.routes";
import { errorHandler, notFound } from "./middlewares/error-handler";

export const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    api: "PetHelp API",
    recursos: ["/tutores", "/pets", "/consultas"],
  });
});

app.use("/tutores", tutorRoutes);
app.use("/pets", petRoutes);
app.use("/consultas", consultaRoutes);

app.use(notFound);
app.use(errorHandler);
