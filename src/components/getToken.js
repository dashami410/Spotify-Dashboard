
import axios from 'axios';

const client_id = 'client_id'; 
const client_secret = 'client_secret'; 

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
