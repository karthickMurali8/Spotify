import { Loader } from "lucide-react";

const Spinner = () => {
    return (
        <div className='w-16 h-16 border-4 border-zinc-800 border-t-green-500 rounded-full animate-spin mx-auto' />

        
        // <div className="h-screen flex items-center justify-center w-full">
        //     <Loader className="animate-spin size-8 text-emerald-500" />
        // </div>
    )
}

export default Spinner;