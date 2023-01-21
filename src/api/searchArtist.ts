import axios from 'axios'

export async function searchArtist(
    inputValue: string,
    token: string
): Promise<any> {
    return axios.get(`https://api.spotify.com/v1/search`, {
        params: { q: inputValue, limit: 10, type: 'artist' },
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    // .then((response) => {
    //     if (response.data) {
    //         setSuggestions(response.data.artists.items as Item[])
    //     }
    // })
    // .catch()
}
