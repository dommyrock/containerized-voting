import React from 'react'
import { useStore } from '../store';

export const ActionBar = () => {
    const { addOption, getOptions, clearAllStoreState, removeLastOption, options,setUploading } = useStore(state => state);

    function resetAppStateAndCache() {
        localStorage.clear()
        clearAllStoreState()
        getOptions()
    }

    //Todo
    async function uploadPoll(params) {
        //impliment the upload poll function
        //1 await DB post call,
        //2 when i get the respnse , reddirect to the /poll/[id-hash] (next-router poll/[id-hash])

        //use /poll/[id] folder for dynamic route , and see docs for getStaticPaths,props there 
        setUploading(true)
        debugger;
        //TODO THIS SHOLD UPLOAD TO GO BACKEND ENDPOING AND RETURN POOL ID LINK
        let data = await fetch('http://localhost:8080').then((res) => res)
        setUploading(false)
    }

    return (
        <span className='flex items-center'>
            {/* NOTE: options.length because next item  id===index === options.length */}
            <a className='hover:cursor-pointer' title='Add row' onClick={() => addOption({ id: options?.length, text: "" })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="mx-4 my-2 h-6 text-gray-500 dark:text-gray-300" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </a>
            <a className='hover:cursor-pointer' title='Delete Last Row' onClick={() => removeLastOption()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="mx-4 my-2 h-6 text-red-300 dark:text-gray-300" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </a>
            <a className='hover:cursor-pointer' title='Reset' onClick={() => resetAppStateAndCache()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="mx-4 my-2 h-6 text-blue-400 dark:text-gray-300" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </a>
            <a className='hover:cursor-pointer' title='Publish' onClick={() => uploadPoll()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="mx-4 my-2 h-6 text-teal-500 dark:text-gray-300" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            </a>
        </span>
    )
}
