import fetch from 'node-fetch';
import { stringifyQuery } from '@index';
import { IPlatformQueryObj } from './TPlatforms';

const getUrlAppendedRequest = async (
  edp: 'search' | 'songs',
  params: any,
  token: string,
) => {
  const response = await fetch(
    `https://api.music.apple.com/v1/catalog/ca/${edp}?${stringifyQuery(
      params,
    )}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.json();
};

const applemusic = {
  fromName: async (
    /**
     * [API_DOCS] https://developer.apple.com/documentation/applemusicapi/search_for_catalog_resources
     * Returns a JSON object with of the request to AppleMusic Search API
     * @param token Apple API Access Token
     * @param q Search object
     */
    token: string,
    q: IPlatformQueryObj,
  ) => {
    if (q.isrc) return applemusic.fromIsrc(token, q);

    const res = await getUrlAppendedRequest(
      'search',
      {
        term: q.track,
        limit: 20,
        types: ['songs'],
      },
      token,
    );

    const match = res.results.songs.data.find(
      (elem: any) => elem.attributes.artistName === q.artist,
    );

    return {
      artist: match.artistName,
      track: match.name,
      isrc: match.isrc,
      album: match.albumName,
      year: match.releaseDate,
      img: match.artwork.url,
      url: match.url,
    };
  },

  /**
   * [API_DOCS] https://developer.apple.com/documentation/applemusicapi/get_multiple_catalog_songs_by_isrc
   * Returns a track information from ISRC
   * @param token Apple API Access Token
   * @param query Search object
   */
  fromIsrc: async (token: string, query: IPlatformQueryObj) => {
    const res = await getUrlAppendedRequest(
      'songs',
      { 'filter[isrc]': query.isrc },
      token,
    );

    const match = res.data[0].attributes;

    return {
      artist: match.artistName,
      track: match.name,
      isrc: match.isrc,
      album: match.albumName,
      year: match.releaseDate,
      img: match.artwork.url,
      url: match.url,
    };
  },
  fromUrl: async (
    /**
     * [API_DOCS] https://developer.apple.com/documentation/applemusicapi/get_multiple_catalog_songs_by_id
     * Returns the song from the songID
     * @param token Apple API Access Token
     * @param url Search url
     */
    token: string,
    url: any,
  ) => {
    const res = await getUrlAppendedRequest(
      'songs',
      {
        ids: url.match(/(?<=\?i=)[0-9]+/g),
      },
      token,
    );
    const attr = res.data[0].attributes;

    return {
      artist: attr.artistName,
      track: attr.name,
      isrc: attr.isrc,
      album: attr.albumName,
      year: attr.releaseDate,
      img: attr.artwork.url,
      url: url,
    };
  },
};

export { applemusic };
