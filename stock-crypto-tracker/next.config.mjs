/** @type {import('next').NextConfig} */

function logGreenTick(message) {
  const reset = "\x1b[0m";
  const bright = "\x1b[1m";
  const green = "\x1b[32m";
  const greenTick = `${bright}${green}✓${reset}`;
  return ` ${greenTick} ${message}`;
}

const nextConfig = {
  async rewrites() {
    console.log(logGreenTick('Rewriting requests to port 3030...'));
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3030/api/:path*',
      },
    ];
  },
};

export default nextConfig;
