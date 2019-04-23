import { AzureFunction, Context } from '@azure/functions';
import axios, { AxiosError } from 'axios';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  const { GithubUsername, GithubRepo, GithubToken } = process.env;

  if (!GithubUsername || !GithubRepo || !GithubToken) {
    context.log.error('GitHub settings missing. Exiting.');
    return context.done();
  }

  try {
    const response = await axios.post(`https://api.github.com/repos/${GithubUsername}/${GithubRepo}/pages/builds`, null, {
      headers: {
        'Authorization': `token ${GithubToken}`,
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
