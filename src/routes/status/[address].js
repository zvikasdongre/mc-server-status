import { status, statusBedrock, parseAddress } from 'minecraft-server-util';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ params, url }) => {

    const ip = params.address
    const type = url.searchParams.get('type')
    const query = url.searchParams.get('query')

    if (ip) {

        if (type == 'bedrock' || type == 'mcpe') {
            const address = parseAddress(ip, 19132)
            try {
                const server_status = await statusBedrock(address?.host ? address.host : "", address?.port, { timeout: 600 });
                server_status.serverGUID = server_status.serverGUID.toString()

                return {
                    // @ts-ignore
                    body: {
                        status: server_status
                    }
                }
            } catch (e) {
                return {
                    // @ts-ignore
                    body: {
                        status: {
                            online: false
                        }
                    }
                }
            }
        }

        if (type == 'java') {
            const address = parseAddress(ip, 25565)
            try {
                const server_status = await status(address?.host ? address.host : "", address?.port);

                return {
                    // @ts-ignore
                    body: {
                        status: server_status
                    }
                }
            } catch (e) {
                return {
                    // @ts-ignore
                    body: {
                        status: {
                            online: false
                        }
                    }
                }
            }
        }

        return {
            status: 400,
            body: {
                error: "Invalid server type"
            }
        }

    } else {
        return {
            status: 400,
            body: {
                error: "No ip provided"
            }
        }
    }
};