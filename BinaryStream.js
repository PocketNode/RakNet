class BinaryStream {
    initVars(){
        /** @define {Buffer} */
        this.buffer = Buffer.alloc(32);
        this.offset = 0;
    }

    constructor(buffer){
        this.initVars();

        if(buffer && buffer instanceof Buffer){
            this.buffer = buffer;
        }else if(typeof buffer === "number") {
            this.buffer = Buffer.alloc(buffer);
        }
    }

    increaseOffset(v){
        return (this.offset += v) - v;
    }

    /**
     * Reads a 3-byte big-endian number
     * @returns {number}
     */
    readTriad(){
        return this.buffer.readUIntBE(this.increaseOffset(3), 3);
    }

    /**
     * Writes a 3-byte big-endian number
     * @param v
     * @returns {BinaryStream}
     */
    writeTriad(v){
        this.buffer.writeUIntBE(v, this.increaseOffset(3), 3);
        return this;
    }

    /**
     * Reads a 3-byte little-endian number
     * @returns {number}
     */
    readLTriad(){
        return this.buffer.readUIntLE(this.increaseOffset(3), 3);
    }

    /**
     * Writes a 3-byte little-endian number
     * @param v
     * @returns {BinaryStream}
     */
    writeLTriad(v){
        this.buffer.writeUIntLE(v, this.increaseOffset(3), 3);
        return this;
    }

    /**
     * Reads a byte boolean
     * @returns {boolean}
     */
    readBool(){
        return this.readByte() !== 0;
    }

    /**
     * Writes a byte boolean
     * @param v
     * @returns {BinaryStream}
     */
    writeBool(v){
        this.writeByte(v === true ? 1 : 0);
        return this;
    }

    /**
     * Reads a unsigned/signed byte
     * @param s
     * @returns {number}
     */
    readByte(s = true){
        if(s === true){
            return this.buffer.readInt8(this.increaseOffset(1));
        }else {
            return this.buffer.readUint8(this.increaseOffset(1));
        }
    }

    /**
     * Writes a unsigned/signed byte
     * @param v
     * @returns {BinaryStream}
     */
    writeByte(v){
        this.buffer.writeUInt8(v, this.increaseOffset(1));
        return this;
    }

    /**
     * Reads a 16-bit unsigned or signed big-endian number
     * @param s
     * @returns {number}
     */
    readShort(s = false){
        if(s === true){
            return this.buffer.readInt16BE(this.increaseOffset(2));
        }else{
            return this.buffer.readUInt16BE(this.increaseOffset(2));
        }
    }

    /**
     * Writes a 16-bit signed/unsigned big-endian number
     * @param v
     * @param s
     * @returns {BinaryStream}
     */
    writeShort(v, s = true){
        if(s === true){
            this.buffer.writeInt16BE(v, this.increaseOffset(2));
        }else{
            this.buffer.writeUInt16BE(v, this.increaseOffset(2));
        }
        return this;
    }

    /**
     * Reads a 16-bit signed/unsigned little-endian number
     * @param s
     * @returns {number}
     */
    readLShort(s){
        if(s === true) {
            return this.buffer.readInt16LE(this.increaseOffset(2));
        }else{
            return this.buffer.readUInt16LE(this.increaseOffset(2));
        }
    }

    /**
     * Writes a 16-bit signed/unsigned little-endian number
     * @param v
     * @param s
     * @returns {BinaryStream}
     */
    writeLShort(v, s = true){
        if(s === true){
            this.buffer.writeInt16LE(v, this.increaseOffset(2));
        }else{
            this.buffer.writeUInt16LE(v, this.increaseOffset(2));
        }
        return this;
    }

    readInt(){
        return this.buffer.readInt32BE(this.increaseOffset(4));
    }

    writeInt(v){
        this.buffer.writeInt32BE(v, this.increaseOffset(4));
        return this;
    }

    readLInt(){
        return this.buffer.readInt32LE(this.increaseOffset(4));
    }

    writeLInt(v){
        this.buffer.writeInt32LE(v, this.increaseOffset(4));
        return this;
    }

    readFloat(){
        return this.buffer.readFloatBE(this.increaseOffset(4));
    }

    writeFloat(v) {
        this.buffer.writeFloatBE(v, this.increaseOffset(4));
        return this;
    }

    readLFloat(){
        return this.buffer.readFloatLE(this.increaseOffset(4));
    }

    writeLFloat(v){
        this.buffer.writeFloatLE(v, this.increaseOffset(4));
        return this;
    }

    readDouble(){
        return this.buffer.readDoubleBE(this.increaseOffset(8));
    }

    writeDouble(v) {
        this.buffer.writeDoubleBE(v, this.increaseOffset(8));
        return this;
    }

    readLDouble(){
        return this.buffer.readDoubleLE(this.increaseOffset(8));
    }

    writeLDouble(v){
        this.buffer.writeDoubleLE(v, this.increaseOffset(8));
        return this;
    }

    readLong(){
        return (this.buffer.readUInt32BE(this.increaseOffset(4)) << 8) + this.buffer.readUInt32BE(this.increaseOffset(4));
    }

    writeLong(v){
        let MAX_UINT32 = 0xFFFFFFFF;

        this.buffer.writeUInt32BE((~~(v / MAX_UINT32)), this.increaseOffset(4));
        this.buffer.writeUInt32BE((v & MAX_UINT32), this.increaseOffset(4));

        return this;
    }

    feof(){
        return typeof this.getBuffer()[this.offset] === "undefined";
    }

    readAddress(){
        let addr, port;
        let version = this.readByte();
        switch(version){
            default:
            case 4:
                addr = ((this.readByte()) & 0xff) + "." + ((this.readByte()) & 0xff) + "." + ((this.readByte()) & 0xff) + "." + ((this.readByte()) & 0xff);
                port = this.readShort();
                break;
            // add ipv6 support
        }
        return {ip: addr, port: port};
    }

    writeAddress(addr, port, version = 4){
        this.writeByte(version);
        switch(version){
            default:
            case 4:
                addr.split(".").forEach(b => {
                    this.writeByte((parseInt(b)) & 0xff);
                });
                this.writeShort(port, false);
                break;
        }

        return this;
    }

    writeString(v){
        this.buffer.write(v, this.increaseOffset(v.length), v.length);
        return this;
    }

    /**
     * @returns {Buffer}
     */
    getBuffer(){
        return this.buffer;
    }
}

module.exports = BinaryStream;