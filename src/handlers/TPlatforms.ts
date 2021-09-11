export type TPlatforms = 'spotify' | 'applemusic' | 'youtube';

export interface IPlatformQueryObj {
  artist?: string;
  track?: string;
  isrc?: string;
  album?: string;
  year?: string;
  img?: string;
  url?: string;
}
