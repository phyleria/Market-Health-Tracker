// utils/webhook.js

export async function sendNotification({ notificationType, email, country, sector }) {
  try {
    const res = await fetch(
      "https://invcgroup32.app.n8n.cloud/webhook/9d601821-68f0-4be8-af96-8effb3792bce",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationType,
          email,
          country,
          sector,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Webhook error: ${res.statusText}`);
    }

    const data = await res.json().catch(() => null); // in case it’s not JSON
    return { success: true, data };
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return { success: false, error };
  }
}
