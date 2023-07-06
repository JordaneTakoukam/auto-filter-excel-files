import React, { useState } from 'react';
import { FaTrash, FaPlay, FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import fileDownload from 'js-file-download';
import { FaWhatsapp } from 'react-icons/fa';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [code, setcode] = useState('');
  const [filterValues, setFilterValues] = useState([]);
  const [outputFilename, setOutputFilename] = useState('');
  const [downloadAvailable, setDownloadAvailable] = useState(false);



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



  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };



  const handleScriptCall = () => {
    if (selectedFiles.length > 0) {
      const resultatsFiltres = [];

      selectedFiles.forEach((file, index) => {
        const isFirstFile = index === 0;
        const reader = new FileReader();

        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const colonneCP = jsonData[0].indexOf(code);


          const lignesFiltrees = jsonData.filter((ligne, index) => {
            if (index === 0 && isFirstFile) {
              return true; // Conserver l'en-tête uniquement pour le premier fichier
            } else {
              const codePostal = String(ligne[colonneCP]);
              return filterValues.some(
                (cp) =>
                  codePostal.startsWith(cp[0] === '0' ? cp[1] : cp) &&
                  (cp[0] === '0' ? codePostal.length === 4 : codePostal.length === 5)
              );
            }
          });
          resultatsFiltres.push(lignesFiltrees);


          // Fusionner tous les résultats filtrés en une seule liste
          const lignesFiltreesFinales = resultatsFiltres.flat();

          // Créer une nouvelle feuille de calcul avec les lignes filtrées
          const newWorksheet = XLSX.utils.aoa_to_sheet(lignesFiltreesFinales);

          // Créer un nouveau classeur Excel avec la nouvelle feuille de calcul
          const newWorkbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Résultats');

          // Enregistrer le fichier Excel de résultats
          XLSX.writeFile(newWorkbook, outputFilename + '.xlsx');

          // Déclencher le téléchargement du fichier généré
          const fileData = XLSX.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' });
          fileDownload(fileData, outputFilename + '.xlsx');

          console.log('Fichier de résultats créé avec succès.');
          // setDownloadAvailable(true);
        };

        reader.readAsArrayBuffer(file);
      });
    }
  };


  const handleDownload = () => {
    if (downloadAvailable) {
      // Téléchargement du fichier généré
      const url = window.URL.createObjectURL(new Blob([outputFilename + '.xlsx']));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', outputFilename + '.xlsx');
      document.body.appendChild(link);
      link.click();
      // setDownloadAvailable(false);
    };
  }

  const handleClearApp = () => {
    setDownloadAvailable(false);
    setSelectedFiles([]);
    setcode('');
    setOutputFilename('');
    setFilterValues([]);
  };

  const phoneNumber = '+2365699751';
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}`;



  return (
    <div className='flex flex-col items-center '>
      <h1 className='text-center mt-8 mb-4 text-[25px] w-[500px] font-bold'>Filtreur - <span className='text-blue-400 font-bold'>Excel - </span> <span className='font-bold text-orange-600'>Automatique</span></h1>

      <div className='flex flex-row items-center justify-center'>
        <button
          className={`mx-auto mb-8 ml-[360px] ${downloadAvailable ? 'bg-green-500' : 'bg-green-200 cursor-not-allowed  text-gray-500'}`}
          onClick={handleDownload}
          disabled={!downloadAvailable}
        >
          <div className='flex flex-row items-center justify-center pr-2 '>
            <div className='text-[20px] pr-5'>
              <FaDownload />
            </div>
            Télécharger
          </div>
        </button>

        <div className='pl-[330px] text-gray-500 text-[25px] cursor-pointer hover:text-red-500'
        >
          <FaTrash onClick={handleClearApp} />
        </div>

      </div>
      {/* gauche */}
      <div className='flex flex-row'>
        <div className='w-1/2 bg-blue-100 rounded-xl p-8'>
          <div className='flex flex-col'>
            <label>Ajouter des fichiers excels</label>
            <input className='mt-5' type="file" multiple onChange={handleFileSelect} />
            {selectedFiles.map((file, index) => (
              <p key={index} className='py-1 mt-5 flex flex-row'>
                <span className='font-bold pr-[8px]'>Fichier {index + 1} :</span>
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
        <div className='w-1/2 bg-orange-100 rounded-xl p-8'>
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

            <button className='mx-auto mt-[200px] hover:bg-blue-700 ' onClick={handleScriptCall}>
              <div className='flex flex-row items-center justify-center pr-2'>
                <div className='text-[14px] pr-5'>
                  <FaPlay />
                </div>
                Démarrer
              </div>
            </button>


          </div>
        </div>

      </div>
      <div className='my-8 flex flex-col items-center justify-center'>
        <p>Develop by @jordane 2023-2024.</p>

        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className='flex flex-row items-center justify-center font-bold text-green-600 underline'>
          <div className='text-[25px] pr-1'>
            <FaWhatsapp /> </div>Contact  me on WhatsApp

        </a>
      </div>
    </div>
  );
}

export default App;
