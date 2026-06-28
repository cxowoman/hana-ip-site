create extension if not exists pg_cron;
create extension if not exists pg_net;
create extension if not exists supabase_vault;

-- Replace these three values before running this file.
select vault.create_secret(
  'https://YOUR_PROJECT_REF.supabase.co',
  'project_url'
);
select vault.create_secret(
  'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY',
  'publishable_key'
);
select vault.create_secret(
  'REPLACE_WITH_A_LONG_RANDOM_CRON_SECRET',
  'gmail_reminder_cron_secret'
);

select cron.schedule(
  'process-gmail-reminders-every-15-minutes',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := (
      select decrypted_secret
      from vault.decrypted_secrets
      where name = 'project_url'
    ) || '/functions/v1/process-email-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'publishable_key'
      ),
      'apikey', (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'publishable_key'
      ),
      'x-cron-secret', (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'gmail_reminder_cron_secret'
      )
    ),
    body := jsonb_build_object('invoked_at', now())
  );
  $$
);
