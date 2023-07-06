import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { filterExcel } from './filter';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [code, setcode] = useState('');
  const [filterValues, setFilterValues] = useState([]);
  const [outputFilename, setOutputFilename] = useState('');

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handlecodeChange = (event) => {
    setcode(event.target.value);
  };

  const handleFilterValuesChange = (event) => {
    const values = event.target.value.split(',').map((value) => value.trim());
    setFilterValues(values);
  };

  const handleOutputFilenameChange = (event) => {
    setOutputFilename(event.target.value);
  };

  const handleFileRemove = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleScriptCall = () => {
    filterExcel(selectedFiles, filterValues, code, outputFilename);
  };


  return (
    <div className='flex flex-col items-center '>
      <h1 className='text-center my-8 text-[25px] w-[500px] font-bold'>Filtreur - <span className='text-blue-400 font-bold'>Excel - </span> <span className='font-bold text-orange-600'>Automatique</span></h1>


      {/* gauche */}
      <div className='flex flex-row'>
        <div className='w-1/2 bg-blue-100 rounded-md p-8'>
          <div className='flex flex-col'>
            <label>Ajouter des fichiers excels</label>
            <input type="file" multiple onChange={handleFileSelect} />
            {selectedFiles.map((file, index) => (
              <p key={index} className='py-1 mt-5 flex flex-row'>
                <span className='font-bold'>Fichier {index + 1} : </span>
                {file.name}
                <FaTrash
                  className='ml-2 text-red-400 cursor-pointer'
                  onClick={() => handleFileRemove(index)}
                />
              </p>
            ))}
          </div>
        </div>

        {/* droite */}
        <div className='w-1/2 bg-orange-100 rounded-md p-8'>
          <div className='flex flex-col'>
            <div className='flex flex-row items-center justify-center '>
              <label>Code </label>
              <input
                type="text"
                placeholder='CP'
                value={code}
                onChange={handlecodeChange}
              />
            </div>

            <div className='flex flex-row items-center mt-8'>
              <label>Valeurs à filtrer </label>
              <input
                type="text"
                placeholder='01, 69, 38, 32'
                value={filterValues.join(', ')}
                onChange={handleFilterValuesChange}
              />
            </div>

            <div className='flex flex-row items-center mt-7'>
              <label>Fichier de sortie </label>
              <input
                type="text"
                placeholder='resultat'
                value={outputFilename}
                onChange={handleOutputFilenameChange}
              />
            </div>

            <button className='mx-auto mt-[200px]' onClick={handleScriptCall}>Démarrer</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
