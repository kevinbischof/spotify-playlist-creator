import axios from 'axios'

export async function getUser(token: string): Promise<any> {
    return axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
}
