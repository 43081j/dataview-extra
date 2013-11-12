/*
 * dataview-extra.js
 * 43081j
 * License: MIT, see LICENSE
 */
DataView.decodeUtf8 = function decodeUtf8(arrayBuffer) {
  var result = "";
  var i = 0;
  var c = 0;
  var c1 = 0;
  var c2 = 0;

  var data = new Uint8Array(arrayBuffer);

  // If we have a BOM skip it
  if (data.length >= 3 && data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf) {
    i = 3;
  }

  while (i < data.length) {
    c = data[i];

    if (c < 128) {
      result += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      if (i + 1 >= data.length) {
        throw "UTF-8 Decode failed. Two byte character was truncated.";
      }
      c2 = data[i + 1];
      result += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      if (i + 2 >= data.length) {
        throw "UTF-8 Decode failed. Multi byte character was truncated.";
      }
      c2 = data[i + 1];
      c3 = data[i + 2];
      result += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return result;
}


DataView.prototype.getString = function(length, offset) {
	offset = offset || 0;
	length = length || (this.byteLength - offset);
	if(length < 0) {
		length += this.byteLength;
	}
	var data = [];
	for(var i = offset; i < (offset + length); i++) {
		data.push(this.getUint8(i));
	}

	if(typeof Buffer !== 'undefined') {
		return (new Buffer(data)).toString();
	} else {
		return DataView.decodeUtf8(data);
	}
};

DataView.prototype.getStringUtf16 = function(length, offset, bom) {
	offset = offset || 0;
	length = length || (this.byteLength - offset);
	var littleEndian = false,
		str = '',
		useBuffer = false;
	if(typeof Buffer !== 'undefined') {
		str = [];
		useBuffer = true;
	}
	if(length < 0) {
		length += this.byteLength;
	}
	if(bom) {
		var bomInt = this.getUint16(offset);
		if(bomInt === 0xFFFE) {
			littleEndian = true;
		}
		offset += 2;
		length -= 2;
	}
	for(var i = offset; i < (offset + length); i += 2) {
		var ch = this.getUint16(i, littleEndian);
		if((ch >= 0 && ch <= 0xD7FF) || (ch >= 0xE000 && ch <= 0xFFFF)) {
			if(useBuffer) {
				str.push(ch);
			} else {
				str += String.fromCharCode(ch);
			}
		} else if(ch >= 0x10000 && ch <= 0x10FFFF) {
			ch -= 0x10000;
			if(useBuffer) {
				str.push(((0xFFC00 & ch) >> 10) + 0xD800);
				str.push((0x3FF & ch) + 0xDC00);
			} else {
				str += String.fromCharCode(((0xFFC00 & ch) >> 10) + 0xD800) + String.fromCharCode((0x3FF & ch) + 0xDC00);
			}
		}
	}
	if(useBuffer) {
		return (new Buffer(str)).toString();
	} else {
		return decodeURIComponent(escape(str));
	}
};

DataView.prototype.getSynch = function(num) {
	var out = 0,
		mask = 0x7f000000;
	while(mask) {
		out >>= 1;
		out |= num & mask;
		mask >>= 8;
	}
	return out;
};

DataView.prototype.getUint8Synch = function(offset) {
	return this.getSynch(this.getUint8(offset));
};

DataView.prototype.getUint32Synch = function(offset) {
	return this.getSynch(this.getUint32(offset));
};

/*
 * Not really an int as such, but named for consistency
 */
DataView.prototype.getUint24 = function(offset, littleEndian) {
	if(littleEndian) {
		return this.getUint8(offset) + (this.getUint8(offset + 1) << 8) + (this.getUint8(offset + 2) << 16);
	}
	return this.getUint8(offset + 2) + (this.getUint8(offset + 1) << 8) + (this.getUint8(offset) << 16);
};
