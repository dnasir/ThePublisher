import { AzureFunction, Context } from '@azure/functions';

const func: AzureFunction = async function (context: Context): Promise<void> {
  const { RssFeedUrl } = process.env;

  context.log(`[RssCheckerTimer] Processing RSS feed URL: ${RssFeedUrl}.`);

  context.bindings.outputQueueItem = RssFeedUrl;
};

export default func;
