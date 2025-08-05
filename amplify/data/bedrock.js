// versión con respuesta anterior como contexto
export function request(ctx) {
  const { question = "", context = "" } = ctx.args;

  return {
    resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: context + "\n" + question }],
          },
        ],
      }),
    },
  };
}


export function response(ctx) {
  const parsedBody = JSON.parse(ctx.result.body);
  return {
    body: parsedBody.content?.[0]?.text || "Sin respuesta del modelo",
    error: parsedBody.error || "",
  };
}




// #########################################################################
// Versión anterior
/*
export function request(ctx) {
  const { prompt = "" } = ctx.args;

  return {
    resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: prompt }],
          },
        ],
      }),
    },
  };
}

export function response(ctx) {
  const parsedBody = JSON.parse(ctx.result.body);
  return {
    body: parsedBody.content?.[0]?.text || "Sin respuesta del modelo",
  };
}
*/