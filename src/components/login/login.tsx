import { ReactElement, useEffect, useState } from 'react'
import './login.styles.css'
import env from 'react-dotenv'
import { SearchBar } from '../searchbar/searchbar'
import { User } from '../searchbar/spotify.types'
import { getUser } from './login.helpers'

type LoginProps = {}

export default function Login(props: LoginProps): ReactElement {
    const nodeEnv = env?.NODE_ENV || null
    const CLIENT_ID = '430fcf1880e94356ba68e8178e1efe00'
    const REDIRECT_URI =
        nodeEnv === 'develop'
            ? 'http://localhost:3000'
            : 'https://kevinbischof.github.io/spotify-playlist-creator/'
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
    const RESPONSE_TYPE = 'token'
    const SCOPE = 'playlist-modify-public'
    const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`

    const [token, setToken] = useState<string>()
    const [user, setUser] = useState<User>()

    useEffect(() => {
        if (token) {
            getUser(token).then((response) => {
                if (response.data) {
                    setUser(response.data as User)
                }
            })
        }
    }, [token])

    useEffect(() => {
        const { hash } = window.location
        const tokenFromLocalStorage = window.localStorage.getItem('token')

        if (tokenFromLocalStorage) {
            setToken(tokenFromLocalStorage)
        }

        if (!tokenFromLocalStorage && hash) {
            const accessToken = hash
                .substring(1)
                .split('&')
                .find((elem) => elem.startsWith('access_token'))
                ?.split('=')[1]

            if (accessToken) {
                window.location.hash = ''
                window.localStorage.setItem('token', accessToken)
                setToken(accessToken)
            }
        }
    }, [])

    function handleLogout(): void {
        setToken('')
        window.localStorage.removeItem('token')
    }

    return (
        <div className="login">
            {token && (
                <div className="loginButtonWrapper">
                    <button
                        className="loginButton"
                        type="submit"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
            {!token && (
                <a href={url} className="loginButton">
                    Login with Spotify
                </a>
            )}
            {token && <SearchBar token={token} user={user} />}
        </div>
    )
}
