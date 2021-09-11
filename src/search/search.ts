import {
  platforms,
  TPlatforms,
  validator,
  isObj,
  TValidityStatus,
  Track,
} from '@index';

const customResponse = (status, message, data?, platformLinks?) => ({
  status: status,
  message: message,
  ...(data && { data }),
  ...(platformLinks && { platformLinks }),
});

const getUrlIfValid = (obj) => (isObj(obj) ? obj.url : 'notfound');
const getUrlFilterMetadata = (platformLinks) => {
  const { spotify: spo, applemusic: app, youtube: you } = platformLinks;
  return [
    isObj(spo) ? spo : isObj(app) ? app : you,
    {
      spotify: getUrlIfValid(spo),
      applemusic: getUrlIfValid(app),
      youtube: getUrlIfValid(you),
    },
  ];
};

const routeAndCatchErrors = async (
  platform: TPlatforms,
  type: 'url' | 'name',
  token: string,
  payload: any,
) => {
  try {
    return await platforms[platform][type === 'url' ? 'fromUrl' : 'fromName'](
      token,
      payload,
    );
  } catch (e) {
    return e.toString();
  }
};

const getPlatformResults = async (urlPlatform, dataFromUrl, tokens) => {
  let promises;
  switch (urlPlatform) {
    case 'spotify':
      promises = await Promise.all(
        ['applemusic', 'youtube'].map((elem: any) =>
          routeAndCatchErrors(elem, 'name', tokens[elem], dataFromUrl),
        ),
      );
      return {
        spotify: dataFromUrl,
        applemusic: promises[0],
        youtube: promises[1],
      };

    case 'applemusic':
      promises = await Promise.all(
        ['spotify', 'youtube'].map((elem: any) =>
          routeAndCatchErrors(elem, 'name', tokens[elem], dataFromUrl),
        ),
      );
      return {
        spotify: promises[0],
        applemusic: dataFromUrl,
        youtube: promises[1],
      };

    case 'youtube':
      const spotify = await routeAndCatchErrors(
        'spotify',
        'name',
        tokens['spotify'],
        dataFromUrl,
      );
      const applemusic = await routeAndCatchErrors(
        'applemusic',
        'name',
        tokens['applemusic'],
        isObj(spotify) ? spotify : dataFromUrl,
      );
      return {
        spotify,
        applemusic,
        youtube: dataFromUrl,
      };
  }
};

const saveResultIfAllPlatformsFound = async (data, platformLinks) => {
  if (
    Object.values(platformLinks).filter((elem) => elem !== 'notfound')
      .length === 3
  ) {
    const track = new Track({
      data: data,
      platformLinks: platformLinks,
      searchCounter: 1,
    });
    track.save(function (err) {
      if (err) return err.message;
    });
  }
};

export const search = async (url: any, tokens: any) => {
  try {
    // Check if url pattern is spotify, applemusic, youtube or invalid
    const urlPlatform: TValidityStatus = validator.urlStatus(url);

    /* A. IF URL INVALID */
    if (urlPlatform === 'invalid') {
      return customResponse('error', 'Invalid url supplied.');
    }

    // Check if request already in database
    const dbQueryResult = await Track.findByUrl(url);

    /* B. IF REQUEST ALREADY IN DB */
    if (dbQueryResult) {
      const { data, platformLinks } = dbQueryResult;
      return customResponse(
        'success',
        'already in db, no token used',
        data,
        platformLinks,
      );
    }

    // Get data like artist, album, cover, etc from the supplied URL
    const dataFromUrl = await platforms[urlPlatform].fromUrl(
      tokens[urlPlatform],
      url,
    );

    // Get object with results of all platforms
    const platformResults = await getPlatformResults(
      urlPlatform,
      dataFromUrl,
      tokens,
    );

    // Separate data (most complete of all three platforms) and platformLinks
    const [data, platformLinks] = getUrlFilterMetadata(platformResults);

    // Only save result if found for all three platforms
    await saveResultIfAllPlatformsFound(data, platformLinks);

    /* C. IF RESULT WAS FOUND */
    return customResponse('success', '', data, platformLinks);
  } catch (e) {
    return customResponse('error', e.toString());
  }
};
