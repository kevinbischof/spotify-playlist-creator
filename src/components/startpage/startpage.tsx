import { ReactElement } from 'react'
import Login from '../login/login'
import './startpage.styles.css'
import '../../shared/sharedStyles.css'

type StartpageProps = {}

export default function Startpage(props: StartpageProps): ReactElement {
    return (
        <div className="startpage">
            <h1>Spotify Playlist Creator</h1>
            <Login />
        </div>
    )
}
