import OpenAI from "openai";

const SYSTEM_PROMPT =
	"You are a helpful, friendly assistant. Provide concise and accurate responses.";

export default {
	/**
	 * Main request handler for the Worker
	 */
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const url = new URL(request.url);

		// Handle static assets (frontend)
		if (url.pathname === "/" || !url.pathname.startsWith("/api/")) {
			return new Response("Not found", { status: 404 });
		}

		// Handle CORS preflight requests
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 200,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization",
					"Access-Control-Max-Age": "86400",
				},
			});
		}

		// API Routes
		if (url.pathname === "/api/generate") {
			// Handle POST requests for chat
			if (request.method === "POST") {
				return handleChatRequest(request, env);
			}

			// Method not allowed for other request types
			return new Response("Method not allowed", { status: 405 });
		}

		// Handle 404 for unmatched routes
		return new Response("Not found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;

/**
 * Handles chat API requests
 */
async function handleChatRequest(
	request: Request,
	env: Env,
): Promise<Response> {
	try {
		const client = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
		});

		// Parse JSON request body
		const { expressions = {} } = (await request.json()) as {
			expressions: Record<string, number>;
		};

		const response = await client.chat.completions.create({
			model: "gpt-5-nano",
			messages: [
				{
					role: "developer",
					content: "You are an emotion caption generator. Identify the expression with the highest probability. Generate a short, fun, witty Korean sentence (max 20 chars). Do not mention probabilities."
				},
				{
					role: "user",
					content: JSON.stringify({ expressions }),
				}
			],
		});

		// Return JSON response with CORS headers
		const phrase = response.choices[0].message.content;
		return new Response(JSON.stringify({ phrase }), {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json; charset=utf-8",
			}
		});
	} catch (error) {
		console.error("Error processing chat request:", error);
		return new Response(
			JSON.stringify({ error: "Failed to process request" }),
			{
				status: 500,
				headers: {
					"content-type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			},
		);
	}
}