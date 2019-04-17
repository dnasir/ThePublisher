import { AzureFunction, Context } from '@azure/functions';
import axios, { AxiosError } from 'axios';
import config from 'root/package.json';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  if (!config.github) {
    context.log.error('GitHub settings missing. Exiting.');
    return context.done();
  }

  try {
    const response = await axios.post(`https://api.github.com/repos/${config.github.username}/${config.github.repo}/pages/builds`, null, {
      headers: {
        'Authorization': `token ${config.github.token}`,
        'Accept': 'application/vnd.github.mister-fantastic-preview+json',
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
      }
    });

    context.log('Received response from GitHub', response.data);
  } catch (e) {
    const error = e as AxiosError;
    context.log('An error occurred while running function', error);
  } finally {
    context.done();
  }
};

export default timerTrigger;
