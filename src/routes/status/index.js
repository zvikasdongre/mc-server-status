import { status, statusBedrock, parseAddress } from 'minecraft-server-util';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ params, url }) => {

    const ip = url.searchParams.get('address')
    const type = url.searchParams.get('type')
    const query = url.searchParams.get('query')

    if (ip.trim() === '') {
        return {
            status: 400,
            body: {
                error: "No ip provided"
            }
        }
    }

    if (type == 'bedrock' || type == 'mcpe') {
        const address = parseAddress(ip, 19132)

        try {
            const server_status = await statusBedrock(address?.host ? address.host : "", address?.port, { timeout: 600 });
            server_status.serverGUID = server_status.serverGUID.toString()

            return {
                // @ts-ignore
                body: {
                    online: true,
                    ...server_status
                }
            }
        } catch (e) {
            return {
                // @ts-ignore
                body: {
                    online: false
                }
            }
        }
    } else if (type == 'java') {
        const address = parseAddress(ip, 25565)
        try {
            const server_status = await status(address?.host ? address.host : "", address?.port, { timeout: 600 });

            return {
                // @ts-ignore
                body: {
                    online: true,
                    ...server_status
                }
            }
        } catch (e) {
            return {
                // @ts-ignore
                body: {
                    online: false
                }
            }
        }
    } else {
        return {
            status: 400,
            body: {
                error: `Invalid server type "${type}", only "mcpe", "bedrock" and "java" are accepted.`
            }
        }
    }
}