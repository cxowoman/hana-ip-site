function encodeUtf8Base64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

function encodeBase64Url(value: string) {
  return encodeUtf8Base64(value)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function getGmailAccessToken() {
  const clientId = Deno.env.get("GMAIL_CLIENT_ID");
  const clientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GMAIL_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Gmail OAuth secrets are not configured");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const result = await response.json();

  if (!response.ok || !result.access_token) {
    throw new Error(result.error_description || "Unable to refresh Gmail access token");
  }

  return result.access_token as string;
}

export async function sendGmail(options: {
  to: string;
  subject: string;
  html: string;
  bcc?: string;
}) {
  const sender = Deno.env.get("GMAIL_SENDER_EMAIL");
  if (!sender) throw new Error("GMAIL_SENDER_EMAIL is not configured");
  const senderName = Deno.env.get("GMAIL_SENDER_NAME") || "涵捺 Hana";

  const headers = [
    `From: ${senderName} <${sender}>`,
    `To: ${options.to}`,
    options.bcc ? `Bcc: ${options.bcc}` : "",
    `Subject: =?UTF-8?B?${encodeUtf8Base64(options.subject)}?=`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
  ].filter(Boolean);
  const mimeMessage = `${headers.join("\r\n")}\r\n\r\n${encodeUtf8Base64(options.html)}`;
  const accessToken = await getGmailAccessToken();

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encodeBase64Url(mimeMessage) }),
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Gmail API send failed");
  }

  return result;
}
