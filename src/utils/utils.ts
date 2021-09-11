import * as querystring from 'querystring';

/**
 * Translates a string to base64
 * @param str String to be translated
 */
const toBase64 = (str: string) => Buffer.from(str, 'utf8').toString('base64');

const stringifyQuery = (json: any, encodePlusSign?: boolean) =>
  querystring.stringify(
    json,
    null,
    null,
    encodePlusSign && {
      encodeURIComponent: (elem) => {
        const repSpaces = elem.replace(/\s/g, '+').toLowerCase();
        return repSpaces;
      },
    },
  );

const isObj = (obj) => typeof obj === 'object' && obj !== null;

export { toBase64, stringifyQuery, isObj };
