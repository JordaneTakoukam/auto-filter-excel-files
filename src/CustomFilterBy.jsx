import React from 'react'
import { FaFilter, FaFileExcel } from 'react-icons/fa';
import ButtonStartFilter from './ButtonStartFilter';
import ButtonDownload from './ButtonDownload';

function CustomFilterBy({
    typeDeFiltre,
    idTypeDeFiltre,
    downloadAvailable,
    handleDownload,
    loading,
    allFieldsAvailable,
    handleScriptCall,
    inputPhoneValue,
    inputCPvalue,
    handleOnChangeCP,
    handleOnChangePhone,
    fichierDeSortie,
    handleOnChangeFichierDeSortie,
    handleStartFiltrer,
}) {
    return (
        <div>
            <p className='font-semibold text-[15px] -ml-[2px] text-gray-500 mt-2'>
                👉{typeDeFiltre}
            </p>

            {
                idTypeDeFiltre === "phone" ?
                    <div className='mt-[30px]'>
                        <div className='flex flex-col'>
                            <div className='flex items-center'>
                                <div className=' text-[15px] mr-2'>
                                    <FaFilter />
                                </div>
                                <p className='mb-[5px]'>Les numéros commençant par :  </p>

                            </div>
                            <input
                                type="text"
                                placeholder='ex : 1, 2, 3, 05, 237, 33'
                                value={inputPhoneValue.join(', ')}
                                onChange={handleOnChangePhone}
                            />
                        </div>
                    </div>


                    : idTypeDeFiltre === "postal_code" ?
                        <div className='mt-[30px]'>
                            <div className='flex flex-col'>
                                <div className='flex items-center'>
                                    <div className=' text-[15px] mr-2'>
                                        <FaFilter />
                                    </div>
                                    <p className='mb-[5px]'>Les code postaux commençant par :  </p>

                                </div>
                                <input
                                    type="text"
                                    placeholder='ex : 01, 02, 03, 05, 05, 1, 2'
                                    value={inputCPvalue.join(', ')}
                                    onChange={handleOnChangeCP}
                                />
                            </div>

                        </div> : <></>

            }

            {/* ======== Input du fichier de sortie ======== */}

            {
                idTypeDeFiltre !== "" && <>
                    <div className='flex items-center mt-[25px] mb-[5px]'>

                        <div className=' text-[15px] mr-2'>
                            <FaFileExcel />
                        </div>
                        <p>Nom du fichier sortie (sans extension) </p>
                    </div>
                    <input
                        type="text"
                        placeholder='ex : resultat'
                        value={fichierDeSortie}
                        onChange={handleOnChangeFichierDeSortie}

                    />
                </>
            }





            {/* ======== bouton ======= */}
            {
                idTypeDeFiltre !== "" && (
                    <>
                        <div className='mt-[20px]'>
                            <ButtonStartFilter
                                loading={loading}
                                allFieldsAvailable={allFieldsAvailable}
                                handleStartFiltrer={handleStartFiltrer}
                            />
                        </div>
                        <div className='mt-[50px]'>
                            <ButtonDownload
                                downloadAvailable={downloadAvailable}
                                handleDownload={handleDownload}
                            />
                        </div>
                    </>
                )
            }


        </div>
    )
}

export default CustomFilterBy