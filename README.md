dataview-extras
===

**dataview-extras** introduces extra, common functionality to the `DataView` object for ease of use and to reduce repetition in code.

Methods
===

* `getString(length, offset[, raw])` Returns a string from `offset` for `length` bytes, optionally returning the untouched string if `raw` is true.
* `getStringUtf16(length, offset, bom)` Returns a string formed using the UTF-16 encoded data at `offset`. If `bom` is true and a byte-order mark exists first, the endianness will be changed appropriately.
* `getSynch(num)` Returns a given number after synchronisation (used in some file formats)
* `getUint8Synch(offset)` Returns `getSynch()` of the byte found at `offset`
* `getUint32Synch(offset)` Returns `getSynch()` of the 32-bit integer found at `offset`
* `getUint16(offset)` Returns the number found at `offset`, by reading 16 bits

License
===

MIT
