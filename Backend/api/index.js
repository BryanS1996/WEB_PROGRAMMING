const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/pokemon/:nombre", async (req, res) => {
  const nombre = req.params.nombre.toLowerCase();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nombre}`);
    if (!response.ok) {
      return res.status(404).json({ error: "Pokémon no encontrado" });
    }

    const data = await response.json();
    const descripcion =
      data.flavor_text_entries.find((e) => e.language.name === "es")?.flavor_text ||
      "Sin descripción disponible.";

    res.json({
      nombre: data.name,
      descripcion: descripcion.replace(/\n|\f/g, " ")
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// Exportamos la app → Vercel la convierte en serverless
module.exports = app;
