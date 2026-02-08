/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  /* config options here */
  turbopack:{
    root: __dirname
  },
  images:{
    remotePatterns:[    // To display the random images of a person , its necessary
      {
        protocol:"https",
        hostname:"randomuser.me"
      }
    ]
  },

  experimental:{
    serverActions:{
      bodySizeLimit:"5mb" // can upload images/file of size upto 5mb
    }
  }
  
};

export default nextConfig;
