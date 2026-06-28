import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

async function sendGmail(options: {
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

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function nl2br(value: unknown) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function eventDetailRows(registration: Record<string, unknown>) {
  const rows = [
    ["活動主題", registration.event_title],
    ["活動日期", registration.event_date],
    ["開始時間", registration.event_time],
    ["結束時間", registration.event_end_time || "時間未定"],
    ["地點", registration.event_location || "地點未定"],
    ["名額", registration.event_capacity ? `${registration.event_capacity} 位` : "名額未定"],
    ["費用", registration.event_price || "免費"],
  ];

  return rows
    .map(
      ([label, value]) => `
        <tr>
          <th style="text-align:left;padding:8px 12px;border-bottom:1px solid #e5ebe3;color:#5f6f66;">${escapeHtml(label)}</th>
          <td style="padding:8px 12px;border-bottom:1px solid #e5ebe3;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");
}

function messageFor(type: string, registration: Record<string, unknown>) {
  const titles: Record<string, string> = {
    immediate: `報名成功：${registration.event_title}`,
    two_days_after: `報名提醒：${registration.event_title}`,
    three_days_before: `活動前三天提醒：${registration.event_title}`,
    one_day_before: `活動明天見：${registration.event_title}`,
  };
  const opening =
    registration.email_opening ||
    "親愛的會員您好，\n\n我們已收到您的活動報名，以下是本次活動資訊，請您先保留時間並確認資料。";
  const closing =
    registration.email_closing ||
    "提醒您，報名後 48 小時、課程前三天與課程前一天，系統會再寄出提醒信。\n\n期待在課程現場與您相見。\n\n涵捺 Hana";

  return {
    subject: titles[type] || `活動提醒：${registration.event_title}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Noto Sans TC','Microsoft JhengHei',sans-serif;color:#1f2a24;line-height:1.75;">
      <p>${nl2br(opening)}</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;border-top:1px solid #e5ebe3;">
        ${eventDetailRows(registration)}
      </table>
      <hr />
      <p><strong>報名人：</strong>${escapeHtml(registration.member_name)}</p>
      <p><strong>會員身份：</strong>${escapeHtml(registration.member_type)}</p>
      <p><strong>手機：</strong>${escapeHtml(registration.phone)}</p>
      <p><strong>備註：</strong>${escapeHtml(registration.note || "無")}</p>
      <p>${nl2br(closing)}</p>
      </div>
    `,
  };
}

Deno.serve(async (request) => {
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || request.headers.get("x-cron-secret") !== cronSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const url = new URL(request.url);
  if (url.searchParams.get("mode") === "oauth-exchange") {
    const clientId = Deno.env.get("GMAIL_CLIENT_ID");
    const clientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");
    const { code, redirect_uri: redirectUri } = await request.json();

    if (!clientId || !clientSecret || !code || !redirectUri) {
      return new Response(JSON.stringify({ error: "Missing OAuth configuration" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const tokenResult = await tokenResponse.json();

    return new Response(JSON.stringify(tokenResult), {
      status: tokenResponse.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  const { data: jobs, error } = await supabase
    .from("email_jobs")
    .select("*, registrations(*)")
    .eq("status", "pending")
    .lte("scheduled_for", new Date().toISOString())
    .lt("attempts", 5)
    .order("scheduled_for")
    .limit(50);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let sent = 0;
  for (const job of jobs || []) {
    await supabase
      .from("email_jobs")
      .update({ status: "processing", attempts: job.attempts + 1 })
      .eq("id", job.id)
      .eq("status", "pending");

    try {
      const registration = job.registrations;
      const message = messageFor(job.reminder_type, registration);
      await sendGmail({
        to: registration.email,
        bcc:
          job.reminder_type === "immediate"
            ? Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || undefined
            : undefined,
        subject: message.subject,
        html: message.html,
      });
      await supabase
        .from("email_jobs")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          last_error: null,
        })
        .eq("id", job.id);
      if (job.reminder_type === "immediate") {
        await supabase
          .from("registrations")
          .update({ notification_sent: true, notification_error: null })
          .eq("id", registration.id);
      }
      sent += 1;
    } catch (sendError) {
      const message =
        sendError instanceof Error ? sendError.message : "Unknown Gmail error";
      await supabase
        .from("email_jobs")
        .update({
          status: job.attempts + 1 >= 5 ? "failed" : "pending",
          last_error: message,
        })
        .eq("id", job.id);
    }
  }

  return new Response(JSON.stringify({ processed: jobs?.length || 0, sent }), {
    headers: { "Content-Type": "application/json" },
  });
});
