"use strict";
/*
 * Copyright 2018 8 Birds Video Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * This is a non-standard URL-safe, base-64 representation.
 *
 * It is always padded to byte boundaries.
 *
 * All standard Base64 characters are used, except '+' is replaced with '-' and
 * '/' is replaced with '_'.
 *
 * Any remaining bits at the end of the base-64 string are discarded, and are set to 0.
 *
 * No padding character is used.
 */
const urlBase64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function createReverseUrlBase64Map() {
    let charMap = {};
    for (let i = 0; i < urlBase64Chars.length; i++)
        charMap[urlBase64Chars[i]] = i;
    return charMap;
}
const reverseBase64Map = createReverseUrlBase64Map(); // char => digit value
function convertToUrlBase64(buf) {
    let base64 = '';
    let usedBytes = 0;
    let num = 0;
    let usedBits = 0;
    while (usedBytes < buf.length) {
        num <<= 8;
        num |= buf[usedBytes++];
        usedBits += 8;
        while (usedBits >= 6) {
            let digit = 0x3F & (num >> (usedBits - 6));
            usedBits -= 6;
            base64 += urlBase64Chars[digit];
        }
    }
    if (usedBits > 0) {
        let digit = 0x3F & (num << (6 - usedBits)); //unused bits are 0 (used only to pad to a multiple of 6 bits)
        base64 += urlBase64Chars[digit];
    }
    return base64;
}
exports.convertToUrlBase64 = convertToUrlBase64;
function parseUrlBase64(urlBase64) {
    let bufLen = (urlBase64.length * 6 / 8) >>> 0; // '>>> 0' to truncate to unsigned 32-bit integer
    let num = 0;
    let usedBits = 0;
    let digit;
    let buf = new Buffer(bufLen);
    let wroteBytes = 0;
    for (let i = 0; i < urlBase64.length; i++) {
        let digitStr = urlBase64[i];
        digit = reverseBase64Map[digitStr];
        if (digit === undefined)
            throw new Error('Invalid url-base64 character \'' + urlBase64[i] + '\'.');
        usedBits += 6;
        num <<= 6;
        num |= digit;
        if (usedBits >= 8) {
            let byte = num >> (usedBits - 8);
            buf[wroteBytes] = byte;
            usedBits -= 8;
            wroteBytes++;
        }
    }
    return buf;
}
exports.parseUrlBase64 = parseUrlBase64;
//# sourceMappingURL=url-base64.js.map