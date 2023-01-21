import axios from 'axios'

export async function getTopTracksFromArtist(
    id: string,
    token: string
): Promise<void> {
    return axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
        params: { market: 'DE' },
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
}
