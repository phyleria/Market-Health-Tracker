// app/api/webhook/route.js
export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch("https://invcgroup32.app.n8n.cloud/webhook/9d601821-68f0-4be8-af96-8effb3792bce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
