export function writeVarInt(value: number) {
    const bytes = [];
    while (value >= 0x80) {
        bytes.push((value & 0x7f) | 0x80);
        value >>>= 7;
    }
    bytes.push(value & 0x7f);
    return Buffer.from(bytes);
}

export function writeString(str: string) {
    const strBuffer = Buffer.from(str, 'utf8');
    const lengthBuffer = writeVarInt(strBuffer.length);
    return Buffer.concat([lengthBuffer, strBuffer]);
}

export function writeUShort(value: number) {
    const buffer = Buffer.alloc(2);
    buffer.writeUInt16BE(value, 0);
    return buffer;
}

export function writeLong(value: number) {
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64BE(BigInt(value), 0);
    return buffer;
}

// Parse VarInt from buffer
export function readVarInt(buffer: Buffer, offset = 0) {
    let value = 0;
    let position = 0;
    let currentByte;

    do {
        if (offset + position >= buffer.length) return null;
        currentByte = buffer[offset + position];
        value |= (currentByte & 0x7f) << (position * 7);
        position++;
    } while ((currentByte & 0x80) !== 0 && position < 5);

    return { value, bytesRead: position };
}

// Parse string from buffer
export function readString(buffer: Buffer, offset: number) {
    const length = readVarInt(buffer, offset);
    if (!length || offset + length.bytesRead + length.value > buffer.length) return null;

    const str = buffer
        .slice(offset + length.bytesRead, offset + length.bytesRead + length.value)
        .toString('utf8');
    return { value: str, bytesRead: length.bytesRead + length.value };
}

// Build handshake packet
export function createHandshakePacket(
    protocolVersion: number,
    serverAddress: string,
    serverPort: number,
    nextState: number
) {
    const packetId = writeVarInt(0x00);
    const protocol = writeVarInt(protocolVersion);
    const address = writeString(serverAddress);
    const port = writeUShort(serverPort);
    const state = writeVarInt(nextState);

    const packetData = Buffer.concat([packetId, protocol, address, port, state]);
    const packetLength = writeVarInt(packetData.length);

    return Buffer.concat([packetLength, packetData]);
}

// Create status request packet
export function createStatusRequestPacket() {
    const packetId = writeVarInt(0x00);
    const packetLength = writeVarInt(packetId.length);
    return Buffer.concat([packetLength, packetId]);
}

// Create ping request packet
export function createPingRequestPacket() {
    const packetId = writeVarInt(0x01);
    const payload = writeLong(1337);
    const packetData = Buffer.concat([packetId, payload]);
    const packetLength = writeVarInt(packetData.length);

    return Buffer.concat([packetLength, packetData]);
}
