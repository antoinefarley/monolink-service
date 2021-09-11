import { TValidityStatus } from '@index';

export const validator = {
  urlStatus: (url: string): TValidityStatus => {
    const isValid = (append) =>
      [
        `https://${append}`,
        `https://www.${append}`,
        `www.${append}`,
        `${append}`,
      ].some((elem) => url.toString().startsWith(elem));

    for (const [platform, url] of Object.entries({
      spotify: 'open.spotify.com',
      applemusic: 'music.apple.com',
      youtube: 'youtube.com',
    })) {
      if (isValid(url)) return platform as TValidityStatus;
    }
    return 'invalid';
  },
};
