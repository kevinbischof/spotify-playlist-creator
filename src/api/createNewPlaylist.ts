import axios from 'axios'

export async function createNewPlaylist(
    userId: string,
    name: string,
    description: string,
    publicOption: boolean,
    token: string
): Promise<any> {
    return axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
            name,
            description,
            public: publicOption,
        },
        {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    )
}
