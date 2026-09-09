"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const path_2 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, '..', 'data', 'bot.db');
// Ensure data directory exists
const dataDir = path_1.default.dirname(dbPath);
const fs2 = require('fs');
if (!fs2.existsSync(dataDir)) {
    fs2.mkdirSync(dataDir, { recursive: true });
}
const db = new better_sqlite3_1.default(dbPath);
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
exports.storage = {
    isNewsSeen: (id) => {
        const stmt = db.prepare('SELECT id FROM seen_news WHERE id = ?');
        return !!stmt.get(id);
    },
    markNewsSeen: (id, source) => {
        const stmt = db.prepare('INSERT OR IGNORE INTO seen_news (id, source) VALUES (?, ?)');
        stmt.run(id, source);
    },
    getCountdownMessageId: () => {
        const stmt = db.prepare('SELECT messageId FROM countdown_state WHERE id = ?');
        const row = stmt.get('main');
        return row ? row.messageId : null;
    },
    setCountdownMessageId: (messageId) => {
        const stmt = db.prepare('INSERT OR REPLACE INTO countdown_state (id, messageId) VALUES (?, ?)');
        stmt.run('main', messageId);
    }
};
//# sourceMappingURL=storage.js.map