import fetch from 'node-fetch';
import { stringifyQuery } from '@index';
import { IPlatformQueryObj } from './TPlatforms';

const spotify = {
  fromName: async (
    /**
     * [API_DOCS] https://developer.spotify.com/documentation/web-api/reference-beta/#category-search
     * Returns a JSON object with of the request to Spotify Search API
     * @param token Spotify API Access Token
     * @param q Search object
     */
    token: string,
    q: IPlatformQueryObj,
  ) => {
    const response = await fetch(
      `https://api.spotify.com/v1/search?${stringifyQuery(
        {
          q: `track:${q.track}+artist:${q.artist}`,
          type: 'track',
        },
        true,
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const res = await response.json();

    const match = res.tracks.items[0];

    return {
      artist: match.artists[0].name,
      track: match.name,
      isrc: match.external_ids.isrc,
      album: match.album.name,
      year: match.album.release_date,
      img: match.album.images[0].url,
      url: match.external_urls.spotify,
    };
  },

  /**
   * Returns the song info by extracting the song id from the URL
   * @param token Spotify API Access Token
   * @param url Search url
   */
  fromUrl: async (token: string, url: any) => {
    const id = url.match(/(?<=\/track\/)[0-9a-zA-Z]+/g)[0];

    const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await response.json();
    return {
      artist: res.artists[0].name,
      track: res.name,
      isrc: res.external_ids.isrc,
      album: res.album.name,
      year: res.album.release_date,
      img: res.album.images[0].url,
      url: url,
    };
  },

  getArtistSongFromString: (description: string) => {
    return {
      song: description.match(/^([^,]*)/gm),
      artist: description.match(/(?<=a\ssong\sby\s+).*?(?=\s+on\sSpotify)/gs),
    };
  },
};

export { spotify };
