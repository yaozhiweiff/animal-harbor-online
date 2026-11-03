CREATE TABLE accounts (
 id TEXT PRIMARY KEY NOT NULL,
 name TEXT NOT NULL,
 name_key TEXT NOT NULL UNIQUE,
 password_salt TEXT NOT NULL,
 password_hash TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE TABLE sessions (
 token_hash TEXT PRIMARY KEY NOT NULL,
 account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE INDEX sessions_expiry ON sessions(expires_at);
CREATE TABLE player_progress (
 account_id TEXT PRIMARY KEY NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 save_data TEXT,
 revision INTEGER DEFAULT 0 NOT NULL,
 peak REAL DEFAULT 0 NOT NULL,
 aquarium_unlocked INTEGER DEFAULT 0 NOT NULL,
 aquarium_json TEXT DEFAULT '{}' NOT NULL,
 updated_at INTEGER NOT NULL,
 last_upload_id TEXT
);
CREATE INDEX player_peak ON player_progress(peak DESC);
CREATE INDEX player_aquarium ON player_progress(aquarium_unlocked);
CREATE TABLE auth_limits (
 key TEXT PRIMARY KEY NOT NULL,
 count INTEGER NOT NULL,
 window_start INTEGER NOT NULL
);
