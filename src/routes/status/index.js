import { status, statusBedrock, parseAddress } from 'minecraft-server-util';
import { geolocation } from '@vercel/edge';

export const config = {
  runtime: 'edge',
};

const region_to_location = (region_code) => {
  let mappings = {
    "arn1": "Stockholm, Sweden",
    "bom1": "Mumbai, India",
    "cdg1": "Paris, France",
    "cle1": "Cleveland, USA",
    "cpt1": "Cape Town, South Africa",
    "dub1": "Dublin, Ireland",
    "fra1": "Frankfurt, Germany",
    "gru1": "São Paulo, Brazil",
    "hkg1": "Hong Kong",
    "hnd1": "Tokyo, Japan",
    "iad1": "Washington, D.C., USA",
    "icn1": "Seoul, South Korea",
    "kix1": "Osaka, Japan",
    "lhr1": "London, United Kingdom",
    "pdx1": "Portland, USA",
    "sfo1": "San Francisco, USA",
    "sin1": "Singapore",
    "syd1": "Sydney, Australia",
    "dev1": "Your PC"
  }

  return mappings[region_code] || region_code;
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async ({ request, url }) => {
  const { region } = geolocation(request)
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
        timeout: 2000
      });
      server_status.serverGUID = server_status.serverGUID.toString();

      return {

        body: {
          online: true,
          edge_region: region_to_location(region),
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
        timeout: 2000
      });

      return {
        body: {
          online: true,
          edge_region: region_to_location(region),
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
