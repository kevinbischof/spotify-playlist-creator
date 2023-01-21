import React, { useEffect, useState } from 'react'
import { useKeyPress } from 'react-use'
import './searchbar.css'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import { Item, Track, User } from './spotify.types'
import { Input } from '../formFields/input'
import { getTopTracksFromArtist } from '../../api/getTopTracksFromArtist'
import { createNewPlaylist } from '../../api/createNewPlaylist'
import { addItemsToPlaylist } from '../../api/addItemsToPlaylist'
import { searchArtist } from '../../api/searchArtist'
import { Checkbox } from '../formFields/checkbox'

interface Props {
    token: string
    user?: User
}

export function SearchBar({ token, user }: Props) {
    const [searchValue, setSearchValue] = useState('')
    const [selectedValues, setSelectedValues] = useState<Item[]>([])
    const [suggestionsList, setSuggestions] = useState<Item[]>()
    const enterKeyPress = useKeyPress('Enter')
    const [highlightIndex, setHighlightIndex] = useState(0)
    const [tracks, setTracks] = useState<Track[]>([])
    const [playlistName, setPlayListName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [isPublic, setIsPublic] = useState<boolean>(false)

    useEffect(() => {
        console.log(tracks)
    }, [tracks])

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        setSearchValue(inputValue)

        if (inputValue.length > 0) {
            const response = await searchArtist(inputValue, token)
            if (response?.data) {
                setSuggestions(response.data.artists.items as Item[])
            }
        }
    }

    async function handleGetTopTracksFromArtist(
        suggestion: Item
    ): Promise<void> {
        // @ts-ignore
        const { data } = await getTopTracksFromArtist(suggestion.id, token)
        if (data && data.tracks) {
            setTracks(tracks.concat(data.tracks))
        }
    }

    const handleSelection = async (suggestion: Item) => {
        setSelectedValues([...selectedValues, suggestion])
        setSearchValue('')
        setHighlightIndex(0)
        setSuggestions(suggestionsList?.filter((s) => s.id !== suggestion.id))
        await handleGetTopTracksFromArtist(suggestion)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (suggestionsList) {
                setHighlightIndex(
                    (highlightIndex + suggestionsList.length - 1) %
                        suggestionsList.length
                )
            }
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (suggestionsList) {
                setHighlightIndex((highlightIndex + 1) % suggestionsList.length)
            }
        }
        if (e.key === 'Enter') {
            e.preventDefault()
            if (suggestionsList && suggestionsList[highlightIndex]) {
                handleSelection(suggestionsList[highlightIndex])
            }
        }
    }

    const handleDelete = (value: Item) => {
        setSelectedValues(selectedValues.filter((item) => item.id !== value.id))
        if (suggestionsList) {
            setSuggestions([...suggestionsList, value])
        }
        setTracks(
            tracks.filter((track) =>
                track.artists.some(
                    (artist) =>
                        artist.name.toUpperCase() !== value.name.toUpperCase()
                )
            )
        )
    }

    async function handleSubmitButton(): Promise<void> {
        if (tracks.length > 0 && user) {
            await createNewPlaylist(
                user.id,
                playlistName,
                description,
                true,
                token
            ).then((response) => {
                if (response.data) {
                    addItemsToPlaylist(response.data.id, token, tracks)
                }
            })
        }
    }

    return (
        <div
            className="search-bar"
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            <div
                className="input-container"
                style={{ flex: 1, position: 'relative' }}
            >
                <Input
                    value={searchValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search..."
                    className="search-input"
                />
                {searchValue.length > 0 && (
                    <div
                        className="suggestions"
                        style={{ backgroundColor: 'lightgray' }}
                    >
                        {suggestionsList &&
                            suggestionsList
                                // filter already selected values
                                .filter(
                                    (suggestion) =>
                                        !selectedValues.some(
                                            (selectedValue) =>
                                                suggestion.name.toUpperCase() ===
                                                selectedValue.name.toUpperCase()
                                        )
                                )
                                // filter includes values
                                .filter((suggestion) =>
                                    suggestion.name
                                        .toUpperCase()
                                        .includes(searchValue.toUpperCase())
                                )
                                .map((suggestion, index) => (
                                    <div
                                        className={`suggestion ${
                                            highlightIndex === index
                                                ? 'highlighted'
                                                : ''
                                        }`}
                                        key={suggestion.id}
                                        onClick={() =>
                                            handleSelection(suggestion)
                                        }
                                        onMouseEnter={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setHighlightIndex(index)
                                        }}
                                        tabIndex={0}
                                        role="button"
                                        onKeyPress={
                                            enterKeyPress
                                                ? () =>
                                                      handleSelection(
                                                          suggestion
                                                      )
                                                : undefined
                                        }
                                    >
                                        <div>{suggestion.name}</div>
                                    </div>
                                ))}
                    </div>
                )}
            </div>
            <div className="selected-values">
                {selectedValues.map((value) => (
                    <div className="selected-value" key={value.id}>
                        <div>{value.name}</div>
                        <div
                            className="icon"
                            onClick={() => handleDelete(value)}
                        >
                            <FaTrash />
                        </div>
                    </div>
                ))}
            </div>
            <Input
                value={playlistName}
                onChange={(e) => setPlayListName(e.target.value)}
                placeholder="Playlist name"
                className="search-input"
            />
            <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="search-input"
            />
            <Checkbox onChange={(e) => console.log(e)} label="Public" />
            {selectedValues.length > 0 && (
                <>
                    <div className="loginButtonWrapper">
                        <button
                            className="loginButton"
                            type="submit"
                            onClick={handleSubmitButton}
                        >
                            Generate
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
