import axios from 'axios';
export { fetchImages };

axios.defaults.baseURL = 'https://pixabay.com/api/';
const apiKey = '34991849-71a852731da427aa7e07f8562';

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  );
  return response;
}