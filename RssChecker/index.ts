import { AzureFunction, Context } from '@azure/functions';
import axios from 'axios';
import FeedParser from 'feedparser';

const func: AzureFunction = async function (context: Context, inputQueueItem: string): Promise<void> {
  if (!inputQueueItem) {
    context.log.error('[RssChecker] RSS feed URL missing. Exiting.');
    return context.done();
  }

  try {
    const feedparser = new FeedParser({
      normalize: false,
      addmeta: false
    });
    const response = await axios({
      method: 'get',
      url: inputQueueItem,
      responseType: 'stream'
    });

    if (response.status !== 200) {
      context.log.error(response.statusText);
      return context.done();
    }

    response.data.pipe(feedparser);

    const latestPosts = await new Promise((resolve, reject) => {
      let items = [];

      feedparser.on('error', reject);
      feedparser.on('end', () => {
        const links = items.map(x => x.link);

        context.log(`[RssChecker] Got ${links.length} link(s).`);

        resolve(links);
      });

      feedparser.on('readable', function () {
        const stream = this;
        let item: any;

        context.log(stream.meta);

        while (item = stream.read()) {
          items.push(item);
        }
      });
    });

    context.bindings.outputQueueItem = latestPosts;
  } catch (e) {
    context.log.error(e);
  }
};

export default func;
