import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store';
import { ActionBar } from './ActionBar';
import { PollRow } from './PollRow';
import UploadInProgress from './UploadInProgress';

export const PollContainer = () => {
    const { addOption, setTitle, setCachedState, options, title, description, uploading } = useStore(state => state);
    const [showCopyNotification, setNotification] = useState(false);

    function handleEnterKey(e) {
        if (e.keyCode === 13/*Enter*/) {
            e.preventDefault();
            if (options?.length === 0)
                addOption({ id: options?.length, text: "" })
        }
    }

    function getDataFromLocalCache() {
        const cachedOptions = localStorage.getItem("poll-options")
        const cachedDetails = localStorage.getItem("poll-details")
        if (cachedDetails || cachedOptions) {
            let data = { options: JSON.parse(cachedOptions), details: JSON.parse(cachedDetails) }
            setCachedState(data)
        }
        return []
    }

    //on initial load/render
    useEffect(() => {
        getDataFromLocalCache()
    }, [])

    //update each time we rerender child/component tree
    useEffect(() => {
        localStorage.setItem("poll-options", JSON.stringify([...options]))
        localStorage.setItem("poll-details", JSON.stringify({ title: title, description: description }))
    })

    return (
        <>
            {uploading ? <UploadInProgress /> :
                <div className="shadow-lg rounded-2xl bg-white dark:bg-gray-700 w-full">
                    {showCopyNotification && <p className="bg-teal-400 text-white text-center p-2">Copied to Clipboard</p>}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start">
                            <p className="font-bold text-md p-4 text-black dark:text-white">
                                <span className='flex items-center'>
                                    Title:
                                    <input id="title-input" className="appearance-none bg-transparent border-b border-teal-400 w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" placeholder='Poll Title' type="text" aria-label='Poll option'
                                        onChange={e => setTitle(e.target.value)} value={title} onKeyUp={(e) => handleEnterKey(e)} />
                                </span>

                            </p>
                        </div>
                    </div>
                    <ul>
                        {options.length > 0 ? options.map((row, idx) => (<PollRow key={idx} props={{ index: idx, row, editMode: true }} />)) : null}
                    </ul>
                    <ActionBar />
                </div>}
        </>
    )
}