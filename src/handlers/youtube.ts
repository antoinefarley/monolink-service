import fetch from 'node-fetch';
import { stringifyQuery } from '@index';
import { IPlatformQueryObj } from './TPlatforms';

const getUrlAppendedRequest = async (edp: 'search' | 'videos', params: any) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/${edp}?${stringifyQuery(params)}`,
    {},
  );
  return response.json();
};

export const youtube = {
  fromName: async (
    /**
     * [API_DOCS] https://developers.google.com/youtube/v3/docs/search
     * Returns an array with 5 possible results in order of likeliness
     * @param token Spotify API Access Token
     * @param q Search object
     */
    token: string,
    q: IPlatformQueryObj,
  ) => {
    const res = await getUrlAppendedRequest('search', {
      part: 'snippet',
      type: 'videos',
      maxResult: '5',
      q: `"${q.artist}" - "${q.track}"`,
      key: token,
    });

    const match = res.items[0];

    return {
      url: `https://www.youtube.com/watch?v=${match.id.videoId}`,
    };
  },

  /**
   * Returns the song info by extract the video id from the url
   * @param token Spotify API Access Token
   * @param url Search url
   */
  fromUrl: async (token: string, url: string) => {
    // Get API response
    const res = await getUrlAppendedRequest('videos', {
      part: 'snippet',
      id: url.match(/(?<=v=).*/)[0],
      key: token,
    });

    // Get the title of the video
    const title = res.items[0].snippet.title;

    const trackArtist = (() => {
      // If video title contains a dash, the artist name and song name will be in a {artist} - {song} format
      if (title.includes('-')) {
        const [artist, track] = title.split('-').map((elem) => elem.trim());
        return {
          artist: artist,
          track: track.replace(
            /\s+[\([]Official\sVideo[\)\]].*|[\([]Official\sMusic\sVideo[\)\]].*/,
            '',
          ),
        };
        // If it doesn't, then only the song title is included
      } else {
        // So we find the artist name in the channel title
        const channelTitle = res.items[0].snippet.channelTitle;

        // But it can also include a dash like {artist} - Title/Official/Etc.
        if (channelTitle.includes('-')) {
          const sep = channelTitle.split(' - ');
          return { artist: sep[0], track: title };
        } else return { artist: channelTitle, track: title };
      }
    })();

    return { url, ...trackArtist };
  },
};
