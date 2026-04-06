import fs from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'

let dbInstance: Database.Database | null = null

function defaultDbPath(): string {
  const fromEnv = process.env.LEADS_SQLITE_PATH
  if (fromEnv && fromEnv.trim() !== '') return fromEnv.trim()
  return path.join(process.cwd(), 'data', 'leads.db')
}

function initSchema(db: Database.Database): void {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_id TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL,
      partner_status TEXT NOT NULL DEFAULT 'none',
      result TEXT NOT NULL DEFAULT 'none',
      owner_tg_user_id INTEGER,
      owner_display TEXT,
      agreement_summary TEXT,
      taken_at TEXT,
      updated_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      closed_at TEXT,
      site_domain TEXT NOT NULL,
      form_id TEXT NOT NULL,
      page_path TEXT,
      page_query TEXT,
      device_class TEXT,
      cta_label TEXT,
      referrer TEXT,
      utm TEXT,
      consent_pd INTEGER NOT NULL DEFAULT 0,
      name TEXT,
      phone_e164 TEXT NOT NULL,
      city_slug TEXT NOT NULL,
      city_label TEXT NOT NULL,
      lead_type TEXT NOT NULL,
      comment TEXT,
      telegram_chat_id TEXT,
      telegram_message_id INTEGER,
      site_payload_raw TEXT,
      alarm_active INTEGER NOT NULL DEFAULT 1,
      alarm_started_at TEXT,
      alarm_last_sent_at TEXT
    );

    CREATE TABLE IF NOT EXISTS lead_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      at TEXT NOT NULL,
      actor_tg_user_id INTEGER,
      action TEXT NOT NULL,
      from_status TEXT,
      to_status TEXT,
      from_partner_status TEXT,
      to_partner_status TEXT,
      meta_json TEXT,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS agreements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_by_tg_user_id INTEGER,
      created_by_display TEXT,
      created_at TEXT NOT NULL,
      next_contact_at TEXT,
      record_status TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_leads_public_id ON leads(public_id);
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
    CREATE INDEX IF NOT EXISTS idx_activity_lead ON lead_activity(lead_id);
    CREATE INDEX IF NOT EXISTS idx_agreements_lead ON agreements(lead_id);

    CREATE TABLE IF NOT EXISTS agreement_input_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT NOT NULL,
      tg_user_id INTEGER NOT NULL,
      lead_id INTEGER NOT NULL,
      lead_public_id TEXT NOT NULL,
      step TEXT NOT NULL,
      draft_text TEXT,
      prompt_message_id INTEGER,
      actor_display TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      UNIQUE(chat_id, tg_user_id),
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_agreement_sessions_chat_user ON agreement_input_sessions(chat_id, tg_user_id);
    CREATE INDEX IF NOT EXISTS idx_agreements_open_next ON agreements(lead_id, record_status, next_contact_at);

    CREATE TABLE IF NOT EXISTS daily_digest_log (
      day_slot TEXT NOT NULL PRIMARY KEY,
      sent_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS periodic_report_log (
      report_key TEXT NOT NULL PRIMARY KEY,
      sent_at TEXT NOT NULL
    );
  `)
  migrateLeadAlarmColumns(db)
}

function migrateLeadAlarmColumns(db: Database.Database): void {
  const cols = db.prepare(`PRAGMA table_info(leads)`).all() as { name: string }[]
  const names = new Set(cols.map(c => c.name))
  if (!names.has('alarm_active')) {
    db.exec(`ALTER TABLE leads ADD COLUMN alarm_active INTEGER NOT NULL DEFAULT 1`)
  }
  if (!names.has('alarm_started_at')) {
    db.exec(`ALTER TABLE leads ADD COLUMN alarm_started_at TEXT`)
  }
  if (!names.has('alarm_last_sent_at')) {
    db.exec(`ALTER TABLE leads ADD COLUMN alarm_last_sent_at TEXT`)
  }
  db.prepare(`UPDATE leads SET alarm_active = 1 WHERE alarm_active IS NULL`).run()
}

/** Singleton БД для Node runtime (не Edge). */
export function getLeadsDb(): Database.Database {
  if (dbInstance) return dbInstance
  const filePath = defaultDbPath()
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const db = new Database(filePath)
  initSchema(db)
  dbInstance = db
  scheduleLeadAlarmSchedulerBootstrap()
  return db
}

/** Планировщик тревоги не через instrumentation (иначе webpack тянет better-sqlite3 в общий граф). */
function scheduleLeadAlarmSchedulerBootstrap(): void {
  if (typeof process === 'undefined') return
  if (process.env.NEXT_RUNTIME === 'edge') return
  queueMicrotask(() => {
    void import('../telegram-leads/alarm-scheduler').then(m => m.ensureLeadAlarmScheduler())
  })
}

/** Только для тестов / особых случаев сброса кэша инстанса. */
export function __resetLeadsDbForTests(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}
