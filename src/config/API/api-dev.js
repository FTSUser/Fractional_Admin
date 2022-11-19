//local

// const protocol = "http";
// const host = "192.168.29.168:4006/api/v1";

//live
const protocol = "https";
const host = "api.fractionalownership.rejoicehub.com/api/v1";

// const protocol = "https";
// const host = "api.fractional.rejoicehub.com/api/v1";

// const host = "94.237.75.196:5000/api/v1";
// const host = "localhost:5000/api";
// const protocol = "http";
// const host = "192.168.29.50:5500/api";

const port = "";
const trailUrl = "";

const hostUrl = `${protocol}://${host}${port ? ":" + port : ""}/`;
const endpoint = `${protocol}://${host}${port ? ":" + port : ""}${trailUrl}`;

export default {
  protocol: protocol,
  host: host,
  port: port,
  apiUrl: trailUrl,
  endpoint: endpoint,
  hostUrl: hostUrl,
};
