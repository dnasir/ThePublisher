import { AzureFunction, Context } from '@azure/functions';
import axios from 'axios';
import FeedParser from 'feedparser';

const func: AzureFunction = async function (context: Context, inputQueueItem: string): Promise<void> {
  if (!inputQueueItem) {
    context.log.error('RSS feed URL missing. Exiting.');
    return context.done();
  }

  try {
    const feedparser = new FeedParser();
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

    const latestPost = await new Promise((resolve, reject) => {
      let items = [];

      feedparser.on('error', reject);
      feedparser.on('end', () => {
        resolve(items.map(x => x.link));
      });

      feedparser.on('readable', function () {
        const stream = this;
        let item: any;

        while (item = stream.read()) {
          items.push(item);
        }
      });
    });

    context.bindings.outputQueueItem = latestPost;
  } catch (e) {
    context.log.error(e);
  }
};

export default func;
