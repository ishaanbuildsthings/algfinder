export default async function fetchURL(url) {
    // TODO: handle errors
    const response = await fetch(url);
    return await response.json();
}