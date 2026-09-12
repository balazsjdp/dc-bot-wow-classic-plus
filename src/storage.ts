import fs from 'fs';
import path from 'path';

interface StorageData {
    seenNews: Record<string, { source: string; timestamp: string }>;
    countdownMessageId: string | null;
}

const dataDir = path.join(__dirname, '..', 'data');
const filePath = path.join(dataDir, 'storage.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function loadData(): StorageData {
    if (!fs.existsSync(filePath)) {
        return { seenNews: {}, countdownMessageId: null };
    }
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
            seenNews: parsed.seenNews || {},
            countdownMessageId: parsed.countdownMessageId || null
        };
    } catch (err) {
        console.error('Failed to read storage.json, using default state:', err);
        return { seenNews: {}, countdownMessageId: null };
    }
}

let data: StorageData = loadData();

function saveData(): void {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error('Failed to write storage.json:', err);
    }
}

export const storage = {
    isNewsSeen: (id: string): boolean => {
        return Boolean(data.seenNews && data.seenNews[id]);
    },
    markNewsSeen: (id: string, source: string) => {
        data.seenNews[id] = {
            source,
            timestamp: new Date().toISOString()
        };
        saveData();
    },
    getCountdownMessageId: (): string | null => {
        return data.countdownMessageId || null;
    },
    setCountdownMessageId: (messageId: string) => {
        data.countdownMessageId = messageId;
        saveData();
    }
};
