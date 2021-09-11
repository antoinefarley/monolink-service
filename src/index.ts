// src/authentication
export { MonolinkApp } from '@app/app';

// src/handlers
import { TPlatforms } from '@handlers/TPlatforms';
import { applemusic } from '@handlers/applemusic';
import { spotify } from '@handlers/spotify';
import { youtube } from '@handlers/youtube';
export { TPlatforms };
export const platforms = { applemusic, spotify, youtube };
export const platformKeys: TPlatforms[] = ['spotify', 'applemusic', 'youtube'];

// src/persistence
export { Track, User } from '@persistence/config';

// src/routes
export { instantiateGenRoutes } from '@routes/routes';

// src/search
export { search } from '@search/search';

// src/tokenizer
export { Tokenizer } from '@tokenizer/tokenizer';
export { SpotifyAccessToken } from '@tokenizer/ITokenizer';

// src/tokenizer
export { validator } from '@validator/validator';
export { TValidityStatus } from '@validator/TValidityStatus';

// src/utils
export { toBase64, stringifyQuery, isObj } from '@utils/utils';
