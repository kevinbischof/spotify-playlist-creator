import axios from 'axios'
import { Track } from './spotify.types'

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
