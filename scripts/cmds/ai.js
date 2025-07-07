async function ai(prompt, id, name, system, gender, model, nsfw, customSystem, link = "") {
  const openRouterApiKey = "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"; // Mets ta clé ici
  
  const sysPrompt = customSystem.find(x => x[system])?.[system] || "You are a helpful assistant.";

  try {
    const response = await post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4", // ou un autre modèle dispo sur OpenRouter
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = response.data.choices?.[0]?.message?.content || "Aucune réponse.";
    return { result };
  } catch (err) {
    const e = err.response?.data;
    const errorMessage = typeof e === 'string' ? e : JSON.stringify(e);
    return {
      result: errorMessage.includes("Payload Too Large") ? "Your text is too long" :
              errorMessage.includes("Unauthorized") ? "Invalid OpenRouter API key." :
              e?.error?.message || err.message || "Unknown error"
    };
  }
}
