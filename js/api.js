const BASE_URL = "https://v2.api.noroff.dev";
const ENDPOINT = `${BASE_URL}/rainy-days`;

async function request(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
    const json = await response.json();
    return json.data;
}

export async function fetchAllProducts() {
    return request(ENDPOINT);
}

export async function fetchProductById(id) {
    return request(`${ENDPOINT}/${id}`);
}