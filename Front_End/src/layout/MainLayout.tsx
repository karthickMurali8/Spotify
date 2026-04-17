import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import React from 'react'
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    const isMobile = window.innerWidth < 768; // Example breakpoint for mobile devices

  return (
  <div className='h-screen bg-black text-white flex flex-col'>
    <ResizablePanelGroup orientation="horizontal" className='flex-1 flex h-full overflow-hidden p-2'>

        {/* Left Panel */}
        {/* <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}> */}
        <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
            Left Panel
        </ResizablePanel>

        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

        {/* Main Content */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
            <Outlet />
        </ResizablePanel>

        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

        {/* Right Panel */}
        <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
            Right Panel
        </ResizablePanel>
    </ResizablePanelGroup>
  </div>
  );
}

export default MainLayout