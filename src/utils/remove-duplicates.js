/**
 * Remove duplicates by creating a Set, which can only
 * take unique values, then converting it back to an array.
 *
 * @param {array} arr
 * @returns {array}
 */
export default arr => Array.from(new Set(arr).values());
