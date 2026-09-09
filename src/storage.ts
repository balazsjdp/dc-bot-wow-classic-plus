import Database from 'better-sqlite3';
import path from 'path';
import fs from 'path';

const dbPath = path.join(__dirname, '..', 'data', 'bot.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
const fs2 = require('fs');
if (!fs2.existsSync(dataDir)) {
    fs2.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize tables
db.exec(`
    CREATE TABLE IF NOT EXISTS seen_news (
        id TEXT PRIMARY KEY,
        source TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS countdown_state (
        id TEXT PRIMARY KEY,
        messageId TEXT
    );
`);

export const storage = {
    isNewsSeen: (id: string): boolean => {
        const stmt = db.prepare('SELECT id FROM seen_news WHERE id = ?');
        return !!stmt.get(id);
    },
    markNewsSeen: (id: string, source: string) => {
        const stmt = db.prepare('INSERT OR IGNORE INTO seen_news (id, source) VALUES (?, ?)');
        stmt.run(id, source);
    },
    getCountdownMessageId: (): string | null => {
        const stmt = db.prepare('SELECT messageId FROM countdown_state WHERE id = ?');
        const row = stmt.get('main') as { messageId: string } | undefined;
        return row ? row.messageId : null;
    },
    setCountdownMessageId: (messageId: string) => {
        const stmt = db.prepare('INSERT OR REPLACE INTO countdown_state (id, messageId) VALUES (?, ?)');
        stmt.run('main', messageId);
    }
};
