import { AzureFunction, Context } from '@azure/functions';

const func: AzureFunction = async function (context: Context): Promise<void> {
  const { RssFeedUrl } = process.env;

  if (!RssFeedUrl) {
    context.log('[RssCheckerTimer] No feed URL found. Exiting.');
    return context.done();
  }

  context.log(`[RssCheckerTimer] Processing RSS feed URL: ${RssFeedUrl}.`);

  context.bindings.outputQueueItem = RssFeedUrl;
};

export default func;
