import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config({
  cloud_name: "diu5lnpgx",
  api_key:"267827865978519",
  api_secret:"8EoDUjn-FsK4GR7xsAvTJam-OAo"
});

export default cloudinary;