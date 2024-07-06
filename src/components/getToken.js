
import axios from 'axios';

const client_id = '25547508b6cd4eb4afda167127756445'; 
const client_secret = '60e09a4440c744569a27c1b18239ebb5'; 

const getToken = async () => {
  const token_url = 'https://accounts.spotify.com/api/token';
  const credentials = btoa(`${client_id}:${client_secret}`);

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post(token_url, params.toString(), {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};

export default getToken;
