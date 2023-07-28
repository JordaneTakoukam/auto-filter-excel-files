import React from 'react'
import { FaDownload } from 'react-icons/fa';


function ButtonDownload({
    downloadAvailable,
    handleDownload
}) {
    return (
        <div
            id="downloadLink"
            className={`px-4 py-3 rounded cursor-pointer w-full ${downloadAvailable
                ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
            onClick={handleDownload}
            disabled={!downloadAvailable}
        >
            <div className='flex flex-row items-center justify-center pr-2 '>
                <div className='text-[20px] pr-5'>
                    <FaDownload />
                </div>
                Sauvegarder
            </div>
        </div>
    )
}

export default ButtonDownload