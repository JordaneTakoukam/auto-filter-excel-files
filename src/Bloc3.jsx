import CustomFilterBy from './CustomFilterBy'

function Bloc3({
    enteteDuFichier,
    typeDeFiltre,
    idTypeDeFiltre,
    downloadAvailable,
    handleDownload,
    loading,
    allFieldsAvailable,
    filterByPostalCode,
    inputPhoneValue,
    inputCPvalue,
    handleOnChangeCP,
    handleOnChangePhone,
    fichierDeSortie,
    handleOnChangeFichierDeSortie,
    handleStartFiltrer
}) {
    return (
        <div className='w-[400px]  bg-blue-100 rounded-3xl p-7 h-[530px]'>

            <p className='font-semibold text-2xl '>Paramètres du filtre</p>

            {enteteDuFichier && typeDeFiltre ? (
                <div>
                    <CustomFilterBy
                        enteteDuFichier={enteteDuFichier}
                        typeDeFiltre={typeDeFiltre}
                        idTypeDeFiltre={idTypeDeFiltre}
                        downloadAvailable={downloadAvailable}
                        handleDownload={handleDownload}
                        loading={loading}
                        allFieldsAvailable={allFieldsAvailable}
                        inputPhoneValue={inputPhoneValue}
                        inputCPvalue={inputCPvalue}
                        handleOnChangeCP={handleOnChangeCP}
                        handleOnChangePhone={handleOnChangePhone}
                        fichierDeSortie={fichierDeSortie}
                        handleOnChangeFichierDeSortie={handleOnChangeFichierDeSortie}
                        handleStartFiltrer={handleStartFiltrer}
                    />
                </div>
            ) : <label className='text-sm text-center mt-[200px] ml-[60px] flex'></label>
            }

        </div>
    )
}

export default Bloc3