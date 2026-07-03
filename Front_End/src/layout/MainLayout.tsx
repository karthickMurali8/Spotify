import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import LeftSideBar from './components/LeftSideBar';
import ChatComponent from '@/components/ChatComponent';
import AudioPlayer from './components/AudioPlayer';
import PlayBackControls from './components/PlayBackControls';

const MainLayout = () => {
    // const isMobile = window.innerWidth < 768; // Example breakpoint for mobile devices

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

  return (
  <div className='h-screen bg-black text-white flex flex-col'>
    <ResizablePanelGroup orientation="horizontal" className='flex-1 flex h-full overflow-hidden p-2'>

        <AudioPlayer />

        {/* Left Panel */}
        {/* <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}> */}
        <ResizablePanel defaultSize='20%' minSize={isMobile ? 0+'%' : 10+'%'} maxSize='30%'>
            <LeftSideBar />
        </ResizablePanel>

        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

        {/* Main Content */}
        <ResizablePanel defaultSize={isMobile ? 80+'%' : 60+'%'}>
            <Outlet />
        </ResizablePanel>

        {   !isMobile && 

            <>
                <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

                {/* Right Panel */}
                <ResizablePanel defaultSize='20%' minSize={0} maxSize='25%' collapsedSize={0}>
                    <ChatComponent />
                </ResizablePanel>
            </>
        }
    </ResizablePanelGroup>

    <PlayBackControls />
  </div>
  );
}

export default MainLayout