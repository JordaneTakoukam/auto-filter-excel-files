import React from 'react'
import { FaPlay } from 'react-icons/fa';

function ButtonStartFilter({
    loading,
    allFieldsAvailable,
    handleStartFiltrer
}) {
    return (
        <div className='bg-transparent flex flex-col items-center justify-center h-[80px]'>
            {
                loading ? <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
                    : <button
                        className={`w-full py-3 text-gray-200
                        ${allFieldsAvailable ? 'bg-blue-500 '
                                : 'bg-gray-400 cursor-not-allowed'}`}
                        onClick={handleStartFiltrer}
                        disabled={!allFieldsAvailable}
                    >
                        <div className='flex flex-row items-center justify-center pr-2'>
                            <div className='text-[16px] pr-5'>
                                <FaPlay />
                            </div>
                            Démarrer le filtreur
                        </div>
                    </button>
            }
        </div>
    )
}

export default ButtonStartFilter