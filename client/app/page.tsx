
import DropppingFiles from "./components/DropppingFiles";
import VideoPlayer from "./components/Hls";
import YouTubeHome from "./components/Home";
import Room from "./components/Room";

export default function Home() {
  return (
<div className="flex w-[100vw] h-[100vh]   justify-center items-center">
   {/* <Room/> */}
   <DropppingFiles/>
   {/* <YouTubeHome/> */}
   {/* <VideoPlayer/> */}
</div>
  );
}
