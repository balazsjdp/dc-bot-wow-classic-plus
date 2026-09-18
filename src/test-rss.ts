import Parser from 'rss-parser';

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0'
    }
});

async function run() {
    const feed = await parser.parseURL('https://www.wowhead.com/forever/news/rss/all');
    console.log(feed.items[0].title);
    console.log(feed.items[0].contentSnippet);
}

run().catch(console.error);
