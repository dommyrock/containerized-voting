import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'
import { PollRow } from '../../components/PollRow'
import NotFound from '../NotFound'
const mock = {
  options: [
    {
      "id": 0,
      "text": "das",
      "upvotes":12
    },
    {
      "id": 1,
      "text": "d",
      "upvotes":16
    },
    {
      "id": 2,
      "text": "as",
      "upvotes":17
    },
    {
      "id": 3,
      "text": "d",
      "upvotes":124
    },
    {
      "id": 4,
      "text": "asd",
      "upvotes":1233
    },
    {
      "id": 5,
      "text": "a",
      "upvotes":12144
    },
    {
      "id": 6,
      "text": "s",
      "upvotes":127676
    },
    {
      "id": 7,
      "text": "",
      "upvotes":1
    }],
  title: "Mock title"
};
const fetcher = (url) => fetch(url).then((res) => mock);
let socket;
if (typeof window !== 'undefined')
{
  socket = new window.WebSocket("ws://127.0.0.1:8080/ws");
}

const Post = () => {
  const router = useRouter()
  const { id } = router.query
  const [showCopyNotification, setNotification] = useState(false);
  const [appData, setAppData] = useState(mock)
  // const [inputValue, setInputValue] = useState('')
  const { data, error } = useSWR(
    "https://api.github.com/repos/vercel/swr",
    fetcher
  );

  function sharePool() {
    navigator.clipboard.writeText(window.location.href);
    setNotification(true);
    setTimeout(() => {
      setNotification(false);
    }, 3000);
  }


  // const data = await fetcher("https://api.github.com/repos/vercel/swr");
  //swr sample:https://swr.vercel.app/examples/basicx


  const handleWsClick = useCallback((e) => {
    e.preventDefault()

    const wsReady = socket?.readyState === WebSocket.OPEN ? true : false;
    console.log(`WS connection ready: ${wsReady}`);

      socket.send(JSON.stringify({
        rowId: 123,
        message: 'tralalala',
        vote:{count:56}//read updated count from UI State
    }))
  }, [])

  useEffect(() => {
    socket.onopen = () => {
      setAppData('Connected')
      console.log('Connected to Go-server [over WS]');
    };
    socket.onmessage = (e) => {
      console.log('Message Event > e: \n', e)
      setAppData(JSON.parse(e.data))
    };
    //TODO :
    //1. Get current poll from server
    //2. Update state with current poll
    //3 Figure out how to update only specific poll opption chat (and not to re-render whole poll)

    //close ws connection when component unmounts
    return () => {
      socket.close()
    }
  }, [])

  if (!data || error) return <NotFound pollId={id} />;
  return <>
    {data &&
      <div className="shadow-lg rounded-2xl bg-white dark:bg-gray-700 w-full">
        {showCopyNotification && <p className="bg-teal-400 text-white text-center p-2">Copied to Clipboard</p>}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <p className="font-bold text-md p-4 text-black dark:text-white">
              {data.title}
              <span className="text-sm text-gray-500 dark:text-gray-300 dark:text-white ml-2">
                (05)
              </span>
            </p>
          </div>
          <a className='p-4 hover:cursor-pointer' title='Copy Link' onClick={() => sharePool()}>
            <div className="flex items-center justify-end">
              <p className='px-2'>Share</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-5 w-5 text-blue-400 dark:text-gray-300" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
          </a>
        </div>
        <ul>
          {(data?.options?.length > 0 && socket) ? data.options.map((row, idx) =>
            (<PollRow key={idx} props={{ index: idx, row, editMode: false,socket }} />)) : null}
        </ul>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={(e) => handleWsClick(e)}> Send over WS</button>
      </div>}
  </>
}

export default Post



// IF I WANT TO PRERENDER SOME PATHS AT THE BUILD TIME  [getStaticPaths + props]
// https://nextjs.org/docs/basic-features/pages#scenario-2-your-page-paths-depend-on-external-data

//if i want to fetch poll data on each request :
//https://nextjs.org/docs/basic-features/pages#server-side-rendering

//NOTE: while app us small its safe to fetch all alive polls and pre render with getStaticPaths,props