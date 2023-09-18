import { status, statusBedrock, parseAddress } from 'minecraft-server-util';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ request, url }) => {
  const ip = url.searchParams.get('address');
  const type = url.searchParams.get('type');

  if (!ip || ip.trim() === '') {
    return {
      status: 400,
      body: {
        error: 'No ip provided'
      }
    };
  }

  if (!type || type.trim() === '') {
    return {
      status: 400,
      body: {
        error: 'Please provide a server type.'
      }
    };
  }

  if (type == 'bedrock' || type == 'mcpe') {
    const address = parseAddress(ip, 19132);

    try {
      const server_status = await statusBedrock(address?.host ? address.host : '', address?.port, {
        timeout: 1000
      });
      server_status.serverGUID = server_status.serverGUID.toString();

      return {

        body: {
          online: true,
          ...server_status
        }
      };
    } catch (e) {
      return {

        body: {
          online: false
        }
      };
    }
  } else if (type == 'java') {
    const address = parseAddress(ip, 25565);
    try {
      const server_status = await status(address?.host ? address.host : '', address?.port, {
        timeout: 1000
      });

      return {
        body: {
          online: true,
          ...server_status
        }
      };
    } catch (e) {
      return {
        body: {
          online: false
        }
      };
    }
  } else {
    return {
      status: 400,
      body: {
        error: `Invalid server type '${type}', only 'mcpe', 'bedrock' and 'java' are accepted.`
      }
    };
  }
};
