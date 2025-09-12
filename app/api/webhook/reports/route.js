import { google } from "googleapis";

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return auth.getClient();
}

export async function POST(req) {
  const { email } = await req.json(); // email from client
  const auth = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SHEET_ID;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A2:F", // A = email, adjust columns
  });

  const rows = response.data.values || [];

  // Filter by email entered
  const reports = rows
    .filter(row => row[0] === email)
    .map((row, i) => ({
      id: String(i + 1),
      email: row[0],
      country: row[1],
      sector: row[2],
      updateTitle: row[3],
      updateText: row[4],
      updateLink: row[5],
    }));

  return new Response(JSON.stringify(reports), {
    headers: { "Content-Type": "application/json" },
  });
}
