import axios from "axios";
import { Buffer } from "buffer";

export async function imageUrlToBase64(imageUrl: string) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64String = Buffer.from(response.data, 'binary').toString('base64');
    return base64String;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
