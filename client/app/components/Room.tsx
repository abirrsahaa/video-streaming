"use client"

import React, { useState } from 'react'
import ReactPlayer from 'react-player'


const Room = () => {

    const [userStream ,setUserStream] = useState(null) ;
    // ! one doubt that i have is that in the below function we areusing await 
    // !that means it should wait until the line gets executed but it continues to stream how is this posssible ?? 
    // ! one thing is  that we can use console.log(stream) to see hoe many times it is getting rendered
    // !and one more thing is that we can look for the documentation of navigator and media devices
    // !and then go to pure basics of js to understand how on earth is this possible 
    const callUser=async ()=>{
        const stream = await navigator.mediaDevices.getUserMedia(
            {
                video:true,
                audio:true
            }
        )
        setUserStream(stream);
    }


  return (
  <div className='w-full h-full flex justify-center items-center gap-10'>  
    <div className='w-[800px] h-[400px] mt-10 mx-10 '>
  <ReactPlayer url='https://www.youtube.com/watch?v=_CFS5uZCcTw' className="w-full h-full" controls={true} />
    </div>
    <button type="button"
               onClick={callUser}
               className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 m-10">Stream</button>
           <div className='w-[800px] h-[400px] mt-10 mx-10 '>
               <ReactPlayer
                  className="w-full h-full" 
                   url={userStream}
                   controls={true}
                   
               />
           </div>


</div>
  )
}

export default Room