//local
// const protocol = "http";
// const host = "192.168.29.226:5000/api/v1";

// const protocol = "http";
// const host = "192.168.29.166:5009/api/v1";

const protocol = "https";
const host = "api.fractionalownership.rejoicehub.com/api/v1";

const port = "";
const trailUrl = "";

const hostUrl = `${protocol}://${host}${port ? ":" + port : ""}`;
const endpoint = `${protocol}://${host}${port ? ":" + port : ""}${trailUrl}`;

export default {
  protocol: protocol,
  host: host,
  port: port,
  apiUrl: trailUrl,
  endpoint: endpoint,
  hostUrl: hostUrl,
};
