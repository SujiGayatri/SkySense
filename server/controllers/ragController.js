
import { getWeatherByCity } from "../controllers/weatherController.js";
import { retrieveDocuments } from "../rag/retrieve.js";
import { buildContext } from "../rag/buildContext.js";
import { askWeather } from "../rag/askWeather.js";



export const getPromptQuery = async (req, res) => {
  try {
    const { city, question } = req.body;

    if (!city || !question) {
      return res.status(400).json({
        error: "City and question are required",
      });
    }

    // Existing weather service
    const weather = await getWeatherByCity(city);

    // Semantic retrieval
    const retrieved = await retrieveDocuments(question);

    // Build LLM context
    const context = buildContext(weather, retrieved.map(r => r.document));

    // Generate answer
    const answer = await askWeather(question, context);

    res.json({
      answer,
      sources: retrieved.map(r => r.metadata.source),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to generate weather advice",
    });
  }
};

