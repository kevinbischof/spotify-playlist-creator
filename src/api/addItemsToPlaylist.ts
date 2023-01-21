import axios from 'axios'
import { Track } from '../components/searchbar/spotify.types'

export async function addItemsToPlaylist(
    playlistId: string,
    token: string,
    tracks: Track[]
): Promise<any> {
    const uris = tracks.map((track) => `spotify:track:${track.id}`)

    return axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
            uris,
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
