import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const required = ["proposalId", "eventTitle", "memberName", "memberType", "email", "phone"];
    const missing = required.filter((key) => !String(body[key] ?? "").trim());

    if (missing.length) {
      return new Response(JSON.stringify({ error: `缺少欄位：${missing.join(", ")}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: registration, error: insertError } = await supabase
      .from("registrations")
      .insert({
        proposal_id: body.proposalId,
        event_title: body.eventTitle,
        event_date: body.eventDate || null,
        event_time: body.eventTime || null,
        event_end_time: body.eventEndTime || null,
        event_location: body.eventLocation || null,
        event_capacity: body.eventCapacity ? Number(body.eventCapacity) : null,
        event_price: body.eventPrice || null,
        email_opening: body.emailOpening || null,
        email_closing: body.emailClosing || null,
        member_name: body.memberName,
        member_type: body.memberType,
        email: body.email,
        phone: body.phone,
        note: body.note || null,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    const now = new Date();
    const eventAt =
      body.eventDate && body.eventTime
        ? new Date(`${body.eventDate}T${body.eventTime}+08:00`)
        : null;
    const reminderJobs = [
      { reminder_type: "immediate", scheduled_for: now },
      {
        reminder_type: "two_days_after",
        scheduled_for: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      },
      ...(eventAt
        ? [
            {
              reminder_type: "three_days_before",
              scheduled_for: new Date(eventAt.getTime() - 3 * 24 * 60 * 60 * 1000),
            },
            {
              reminder_type: "one_day_before",
              scheduled_for: new Date(eventAt.getTime() - 24 * 60 * 60 * 1000),
            },
          ]
        : []),
    ].filter(
      (job) =>
        job.reminder_type === "immediate" ||
        (job.scheduled_for > now && (!eventAt || job.scheduled_for < eventAt)),
    );

    const { error: jobsError } = await supabase.from("email_jobs").insert(
      reminderJobs.map((job) => ({
        registration_id: registration.id,
        reminder_type: job.reminder_type,
        scheduled_for: job.scheduled_for.toISOString(),
      })),
    );
    if (jobsError) throw jobsError;

    let notificationSent = false;
    try {
      const processResponse = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/process-email-reminders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-cron-secret": Deno.env.get("CRON_SECRET") ?? "",
          },
          body: JSON.stringify({ registrationId: registration.id }),
        },
      );
      const processResult = await processResponse.json();
      notificationSent = processResponse.ok && Number(processResult.sent) > 0;
      if (!processResponse.ok) {
        throw new Error(processResult.error || "Immediate Gmail notification failed");
      }
    } catch (emailError) {
      const message =
        emailError instanceof Error ? emailError.message : "Gmail notification failed";
      await supabase
        .from("registrations")
        .update({ notification_error: message })
        .eq("id", registration.id);
    }

    return new Response(
      JSON.stringify({
        registrationId: registration.id,
        notificationSent,
        remindersScheduled: reminderJobs.map((job) => job.reminder_type),
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "報名處理失敗";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
