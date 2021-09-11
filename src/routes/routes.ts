import { search, Track } from '@index';

enum EInputValidityStatus {
  IDLE = 'idle',
  VALID = 'valid',
  INVALID = 'invalid',
}

const isValidUrl = (input) =>
  ['music.apple.com', 'youtube.com', 'open.spotify.com']
    .map((elem) => [`${elem}`, `https://${elem}`, `https://www.${elem}`])
    .some((elem) => elem.some((twotypes) => input.startsWith(twotypes)));

const getInputValidityStatus = (input: string): EInputValidityStatus => {
  const { IDLE, VALID, INVALID } = EInputValidityStatus;
  return input === '' ? IDLE : isValidUrl(input) ? VALID : INVALID;
};

export const instantiateGenRoutes = (router, tokenizer) => {
  router
    .post('/search', async (req, res) => {
      try {
        const { url = '' } = req.body;
        if (getInputValidityStatus(url) !== EInputValidityStatus.VALID) {
          res.status(406).send('incorrect url value');
        } else {
          const actionResponse = await search(url, tokenizer.getTokens());

          res.status(201).send(actionResponse);
        }
      } catch (e) {
        res.status(400).send(e.getMessage());
      }
    })

    .get('/get_top_searches', async (req, res) => {
      // global_searches method goes here
      const actionResponse = await Track.getTopSearches();
      res.status(201).send(actionResponse);
    });
};
