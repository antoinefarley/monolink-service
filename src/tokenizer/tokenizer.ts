import fetch from 'node-fetch';
import { SpotifyAccessToken, TPlatforms, toBase64 } from '@index';

export class Tokenizer {
  private spotifyRefreshRate;
  private tokens = { spotify: '', applemusic: '', youtube: '' };

  constructor() {
    // Spotify
    (async () => {
      await this.updateSpotifyToken();
      this.refreshSpotifyToken();
    })();
    // Apple Music
    this.updateAppleMusicToken();
    // Youtube
    this.updateYoutubeToken();
  }

  getTokens(platform?: null | TPlatforms) {
    return platform ? this.tokens[platform] : this.tokens;
  }

  private async updateSpotifyToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${toBase64(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        )}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const tempTokenRes: SpotifyAccessToken = await response.json();
    this.spotifyRefreshRate = tempTokenRes.expires_in;
    this.tokens.spotify = tempTokenRes.access_token;
  }

  private updateAppleMusicToken() {
    this.tokens.applemusic = process.env.APPLEMUSIC_MUSICKIT_TOKEN;
  }

  private updateYoutubeToken() {
    this.tokens.youtube = process.env.YOUTUBE_API_KEY;
  }

  private refreshSpotifyToken() {
    setInterval(async () => {
      await this.updateSpotifyToken();
    }, (this.spotifyRefreshRate - 360) * 1000);
  }
}
