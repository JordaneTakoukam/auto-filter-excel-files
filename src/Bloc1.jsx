import React from 'react';
import { FaTrash } from 'react-icons/fa';

function Bloc1({ handleFileSelect, fichierSelectionner, handleFileRemove, handleClearApp }) {
  // On suppose que "fichierSelectionner" est un tableau d'objets avec la structure { fichier, nom, icone }.

  return (
    <div className='w-[400px] h-[530px] bg-blue-100 rounded-3xl py-8'>
      <div className='flex flex-row w-full justify-between'>
        <p className='font-semibold text-2xl pl-8 '>Fichiers</p>

        <div className='text-gray-500 text-[20px] cursor-pointer hover:text-red-500 pr-8'>
          <FaTrash onClick={handleClearApp} />
        </div>
      </div>
      <div className='flex flex-col'>
        <p className='font-semibold text-[15px] pl-7 text-gray-500 mt-2'>👉 Ajouter un ou plusieurs fichiers excels</p>

        <input className='mt-5 px-8 py-0' type="file" multiple onChange={handleFileSelect} accept=".xls,.xlsx,.csv" />

        <div className='max-h-[350px] bg-orange-100 w-full mt-5 overflow-y-auto'>
          <table className="border-collapse w-full">
            {fichierSelectionner.length > 0 && (
              <thead>
                <tr>
                  <th className="px-4 py-2 w-50">Fichier</th>
                  <th className=" px-4 py-2 w-200">Nom du fichier</th>
                  <th className="px-4 py-2 w-50">Delete</th>
                </tr>
              </thead>
            )}

            <tbody className=''>
              {fichierSelectionner.map((file, index) => (
                <tr key={index}>
                  <td className="border border-r-0 border-l-0 border-blue-300 px-4 py-2 text-center ml-1">{index + 1}</td>
                  <td className="border border-r-0 border-l-0 border-blue-300 px-4 py-2 text-center">{file.name}</td>
                  <td className="border border-r-0 border-l-0 border-blue-300 px-4 py-2 text-center pl-[40px]">
                    <FaTrash
                      className='text-red-400 cursor-pointer w-5'
                      onClick={() => handleFileRemove(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Bloc1;
