import { json } from '@sveltejs/kit';
import {
    createHandshakePacket,
    createPingRequestPacket,
    createStatusRequestPacket,
    readString,
    readVarInt
} from '$lib/utils';
import type { RequestHandler } from './$types';

import PromiseSocket from 'promise-socket';

export const GET: RequestHandler = async ({ url, request }) => {
    const host = url.searchParams.get('host');
    const port = Number(url.searchParams.get('port')) || 25565;
    if (!host) return new Response('Missing host parameter', { status: 400 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = {};
    // @ts-expect-error - will add cf properties type later
    if (request.cf) {
        // @ts-expect-error - will add cf properties type later
        response.cf = request.cf;
    }
    const handshakePacket = createHandshakePacket(770, host, port, 1);
    const statusRequest = createStatusRequestPacket();
    const pingRequest = createPingRequestPacket();

    let handshakeRequestTimestamp: number | undefined = undefined;
    let handshakeResponseTimestamp: number | undefined = undefined;
    let dataBuffer = Buffer.alloc(0);

    try {
        handshakeRequestTimestamp = Date.now();
        const socket = new PromiseSocket();
        socket.setTimeout(10000);

        await socket.connect({ host, port });

        await socket.write(handshakePacket);
        await socket.write(statusRequest);
        await socket.write(pingRequest);

        const data = (await socket.readAll()) as Buffer;

        if (!data) {
            return json({
                status: 'error',
                message: 'No data received'
            });
        }
        // client.on('data', (data) => {
        dataBuffer = Buffer.concat([dataBuffer, data]);
        handshakeResponseTimestamp = Date.now();
        if (!handshakeRequestTimestamp) {
            await socket.end();
            return json({
                status: 'error',
                message: 'Handshake request not sent'
            });
        }
        const latency = handshakeResponseTimestamp - handshakeRequestTimestamp;
        response.latency = latency;
        if (dataBuffer.length > 0) {
            let offset = 0;

            // Read packet length
            const packetLength = readVarInt(dataBuffer, offset);
            if (!packetLength) {
                return json({
                    status: 'error',
                    message: 'Failed to read packet length'
                });
            }
            offset += packetLength.bytesRead;

            // Read packet ID
            const packetId = readVarInt(dataBuffer, offset);
            if (!packetId) {
                return json({
                    status: 'error',
                    message: 'Failed to read packet ID'
                });
            }
            offset += packetId.bytesRead;

            // Read JSON response
            const jsonResponse = readString(dataBuffer, offset);
            if (!jsonResponse) {
                return json({
                    status: 'error',
                    message: 'Failed to read JSON response'
                });
            }

            const status = JSON.parse(jsonResponse.value);
            await socket.end();
            return json(Object.assign(response, status));
        }
    } catch {
        return json({
            status: 'error',
            message: 'Connection timed out'
        });
    }

    return json({
        status: 'error',
        message: 'Internal error'
    });
};
