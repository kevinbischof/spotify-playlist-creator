import React, { useState } from 'react'
import { useKeyPress } from 'react-use'
import './searchbar.css'
import axios from 'axios'
import { FaTrash } from '@react-icons/all-files/fa/FaTrash'
import { Item, Track, User } from './spotify.types'
import {
    addItemsToPlaylist,
    createNewPlaylist,
    getTopTracksFromArtist,
} from './searchbar.helpers'

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        setSearchValue(inputValue)

        if (inputValue.length > 0) {
            axios
                .get(`https://api.spotify.com/v1/search`, {
                    params: { q: inputValue, limit: 10, type: 'artist' },
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    if (response.data) {
                        setSuggestions(response.data.artists.items as Item[])
                    }
                })
                .catch()
        }
    }

    const handleSelection = (suggestion: Item) => {
        setSelectedValues([...selectedValues, suggestion])
        setSearchValue('')
        setHighlightIndex(0)
        setSuggestions(suggestionsList?.filter((s) => s.id !== suggestion.id))
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
    }

    async function handleSubmitButton(): Promise<void> {
        // @ts-ignore
        const promises = []

        selectedValues.forEach((element) => {
            promises.push(getTopTracksFromArtist(element.id, token))
        })

        // @ts-ignore
        Promise.all(promises).then((responseArray) => {
            responseArray.forEach((response) => {
                setTracks(tracks.concat(response.data.tracks))
            })
        })

        if (tracks.length > 0 && user) {
            console.log('user: ', user)
            createNewPlaylist(user.id, 'test', 'description', true, token).then(
                (response) => {
                    if (response.data) {
                        addItemsToPlaylist(
                            response.data.id,
                            token,
                            tracks
                        ).then()
                    }
                }
            )
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
                <input
                    type="text"
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
