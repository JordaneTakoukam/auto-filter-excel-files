function Bloc2({
  fichierSelectionner,
  listHeadFile,
  listTypeFiltre,
  enteteDuFichier,
  typeDeFiltre,
  handleClick,
  handleFilterClick
}) {

  return (
    <div className='bg-orange-100 rounded-3xl p-7 w-[450px] h-[530px]'>
      {fichierSelectionner.length > 0 ? (
        <>
          <p className='font-semibold text-2xl'>En-têtes détectés sur le fichier</p>

          <p className='mt-2 mb-[20px] font-semibold text-[15px] text-gray-500'>👉 Ajouter un ou plusieurs fichiers excels</p>

          {
            listHeadFile[0] == '' && listHeadFile[1] == '' && listHeadFile[2] == ''
            && <p className="text-red-800 flex justify-center mt-[150px]">Aucune entêtes commune detecter</p>
          }


          {/* En tete des filtres */}
          <div className={`grid 
          ${'grid-cols-3 gap-1'
            } mt-4 ${listHeadFile.length <= 3 ? 'h-[60px]'
              : listHeadFile.length <= 6 ? 'h-[130px]'
                : 'h-[200px]'} `}>
            {
              listHeadFile[0] != '' && listHeadFile[1] != '' && listHeadFile[2] != '' && listHeadFile.map((header, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 rounded cursor-pointer ${header === enteteDuFichier ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-200'
                    }`}
                  onClick={() => {
                    console.log(header)
                    handleClick(header);
                  }

                  }

                >
                  {header}
                </div>
              ))
            }

          </div>

          {/* Type de filtre */}
          {
            listHeadFile[0] != '' && listHeadFile[1] != '' && listHeadFile[2] != '' && <div className='mt-4'>
              <p className='mt-[50px] font-semibold text-[15px] text-gray-500 mb-[10px]'>👉Choisissez un filtre parmi ceux disponible</p>
              <div className='flex flex-col space-y-2 my-2 mb-[20px]'>
                {listTypeFiltre.map((filter, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 rounded cursor-pointer ${filter.title === typeDeFiltre ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-200'
                      }`}
                    onClick={() => {
                      console.log(filter.id);

                      handleFilterClick({ title: filter.title, id: filter.id });
                    }}
                  >
                    {filter.title}
                  </div>
                ))}
              </div>
            </div>
          }



        </>

      ) : (
        <label className='text-sm text-center mt-[200px] ml-[60px] flex'>Aucun fichier excel ajouter pour le moment</label>
      )}
    </div>
  );
}

export default Bloc2;

