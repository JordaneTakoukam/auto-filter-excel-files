import Bloc1 from './Bloc1';
import Bloc2 from './Bloc2';
import Bloc3 from './Bloc3';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';


function App() {
  //
  const [fichierSelectionner, setfichierSelectionner] = useState([]);


  // pour le bloc 3
  const [enteteDuFichier, setenteteDuFichier] = useState('');
  const [typeDeFiltre, settypeDeFiltre] = useState('');
  const [idTypeDeFiltre, setidTypeDeFiltre] = useState('');


  // valeur filtre numero de telephone
  const [inputPhoneValue, setinputPhoneValue] = useState([]);
  // valeur filtre code postaux
  const [inputCPvalue, setinputCPvalue] = useState([]);
  // nom du fichier de sorti
  const [fichierDeSortie, setfichierDeSortie] = useState('');



  const [downloadAvailable, setDownloadAvailable] = useState(false);
  const [allFieldsAvailable, setAllFieldsAvailable] = useState(false);


  // Utilisez un effet pour mettre à jour la disponibilité du bouton lorsque les champs changent
  useEffect(() => {
    const checkFieldsAvailability = () => {
      if (fichierSelectionner.length > 0 && enteteDuFichier !== '' && typeDeFiltre !== ''
        && (inputPhoneValue[0]?.trim() && fichierDeSortie !== "") || (inputCPvalue[0]?.trim() && fichierDeSortie !== "")) {
        setAllFieldsAvailable(true);
      } else {
        setAllFieldsAvailable(false);
      }
    };

    checkFieldsAvailability();
  }, [fichierSelectionner, enteteDuFichier, typeDeFiltre, inputPhoneValue, inputCPvalue, fichierDeSortie, fichierSelectionner]);







  // recuperer les fichiers excel depuis l'appareil 
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const excelFiles = files.filter(file => {
      const fileName = file.name.toLowerCase();
      return fileName.endsWith('.xls') || fileName.endsWith('.xlsx');
    });

    setfichierSelectionner(excelFiles);
    getEnteteFichierExcel(excelFiles);
  };


  const [newWorkbook, setNewWorkbook] = useState(null);

  const filterByPostalCode = () => {
    if (fichierSelectionner.length > 0) {
      setLoading(true);
      setDownloadAvailable(false);

      const resultatsFiltres = [];

      fichierSelectionner.forEach((file, index) => {
        const isFirstFile = index === 0;
        const reader = new FileReader();

        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const colonneCP = jsonData[0].indexOf(enteteDuFichier);

          const lignesFiltrees = jsonData.filter((ligne, index) => {
            if (index === 0 && isFirstFile) {
              return true; // Conserver l'en-tête uniquement pour le premier fichier
            } else {
              // const codePostal = String(ligne[colonneCP]);
              // return inputCPvalue.some(
              //   (cp) =>
              //     codePostal.startsWith(cp[0] === '0' ? cp[1] : cp) &&
              //     (cp[0] === '0' ? codePostal.length === 4 : codePostal.length === 5)
              // );
              const codePostal = String(ligne[colonneCP]);

              // Compléter le code postal avec des zéros à partir de l'avant si sa longueur est inférieure à 5
              const paddedCodePostal = codePostal.padStart(5, '0');

              return inputCPvalue.some((cp) => {
                // Si le préfixe du code postal commence par '0', comparer sans le '0' initial
                const prefix = cp[0] === '0' ? cp.slice(1) : cp;
                return paddedCodePostal.startsWith(prefix);
              });

            }
          });
          resultatsFiltres.push(lignesFiltrees);

          // Fusionner tous les résultats filtrés en une seule liste
          const lignesFiltreesFinales = resultatsFiltres.flat();

          if (index === fichierSelectionner.length - 1) {
            // Créer une nouvelle feuille de calcul avec les lignes filtrées
            const newWorksheet = XLSX.utils.aoa_to_sheet(lignesFiltreesFinales);

            // Créer un nouveau classeur Excel avec la nouvelle feuille de calcul
            const book = XLSX.utils.book_new();
            setNewWorkbook(book);

            XLSX.utils.book_append_sheet(book, newWorksheet, 'Résultats');


            setDownloadAvailable(true);
            setLoading(false);

            // dozwnload
            const excelBuffer = XLSX.write(book, { bookType: 'xlsx', type: 'array' });

            const downloadLink = document.createElement('a');
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = fichierDeSortie + '.xlsx';
            downloadLink.click();
            URL.revokeObjectURL(url);

          }
        }

        reader.readAsArrayBuffer(file);
      });
    }
  };


  // ============================

  const filterByPhone = () => {
    if (fichierSelectionner.length > 0) {
      setLoading(true);
      setDownloadAvailable(false);

      const resultatsFiltres = [];

      fichierSelectionner.forEach((file, index) => {
        const isFirstFile = index === 0;
        const reader = new FileReader();

        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const indexDuHeadPhone = jsonData[0].indexOf(enteteDuFichier);

          const lignesFiltrees = jsonData.filter((ligne, index) => {
            if (index === 0 && isFirstFile) {
              return true; // Conserver l'en-tête uniquement pour le premier fichier
            } else {
              const phoneIndex = String(ligne[indexDuHeadPhone]);
              return inputPhoneValue.some((cp) => phoneIndex.startsWith(cp) && phoneIndex.length <= 10);

            }
          });
          resultatsFiltres.push(lignesFiltrees);

          // Fusionner tous les résultats filtrés en une seule liste
          const lignesFiltreesFinales = resultatsFiltres.flat();

          if (index === fichierSelectionner.length - 1) {
            // Créer une nouvelle feuille de calcul avec les lignes filtrées
            const newWorksheet = XLSX.utils.aoa_to_sheet(lignesFiltreesFinales);

            // Créer un nouveau classeur Excel avec la nouvelle feuille de calcul
            const book = XLSX.utils.book_new();
            setNewWorkbook(book);

            XLSX.utils.book_append_sheet(book, newWorksheet, 'Résultats');


            setDownloadAvailable(true);
            setLoading(false);

            // dozwnload
            const excelBuffer = XLSX.write(book, { bookType: 'xlsx', type: 'array' });

            const downloadLink = document.createElement('a');
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = fichierDeSortie + '.xlsx';
            downloadLink.click();
            URL.revokeObjectURL(url);

          }
        }

        reader.readAsArrayBuffer(file);
      });
    }
  };


  const handleDownload = () => {
    const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });

    const downloadLink = document.createElement('a');
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = fichierDeSortie + '.xlsx';
    downloadLink.click();
    URL.revokeObjectURL(url);

  };


  const handleClearApp = () => {
    setDownloadAvailable(false);
    setfichierSelectionner([]);
    setfichierDeSortie('');
    setinputPhoneValue([]);
    setinputCPvalue([]);
    setListHeadFile([]);
    setenteteDuFichier('');
    settypeDeFiltre('');
    setidTypeDeFiltre('');

  };



  const handleFileRemove = (index) => {
    const updatedFiles = [...fichierSelectionner];
    updatedFiles.splice(index, 1);
    setfichierSelectionner(updatedFiles);
    if (fichierSelectionner.length == 1) {
      setenteteDuFichier('');
      settypeDeFiltre('');
      setidTypeDeFiltre('');
    }

  };


  const phoneNumber = '237698548945';
  const whatsappLink = 'https://api.whatsapp.com/send?phone=' + phoneNumber;

  const [loading, setLoading] = useState(false);




  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // rendu

  const [listHeadFile, setListHeadFile] = useState([]);

  var listTypeFiltre = [
    { title: 'Filtrer par numero de téléphone', id: 'phone' },
    { title: 'Filtrer par code postale', id: 'postal_code' }
  ];


  const getEnteteFichierExcel = (excelFiles) => {
    const file = excelFiles[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const headers = [];

          // Trouver la plage de cellules de la première ligne (entêtes)
          const range = XLSX.utils.decode_range(sheet['!ref']);
          const startCol = range.s.c;
          const endCol = range.e.c;

          for (let col = startCol; col <= endCol; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            const cellValue = sheet[cellAddress] ? sheet[cellAddress].v : '';
            headers.push(cellValue);
          }
          setListHeadFile([...headers]);
        });
      };

      reader.readAsBinaryString(file); // Commencer à lire le fichier sous forme binaire
    }
  };

  // pour le bloc 2 


  const handleClick = (header) => {
    setenteteDuFichier(header === enteteDuFichier ? '' : header);
  };

  const handleFilterClick = ({ title, id }) => {
    settypeDeFiltre(title === typeDeFiltre ? '' : title);
    setidTypeDeFiltre(id === idTypeDeFiltre ? '' : id);
  };



  //
  //
  //
  //
  //
  //
  //
  // pour le bloc 3

  const handleOnChangeCP = (event) => {
    const values = event.target.value.split(',').map((value) => value.trim());
    setinputCPvalue(values);
  };


  const handleOnChangePhone = (event) => {
    const values = event.target.value.split(',').map((value) => value.trim());
    setinputPhoneValue(values);
  }

  const handleOnChangeFichierDeSortie = (event) => {
    setfichierDeSortie(event.target.value);
  };



  // ================== demarer le fitreer ===================
  const handleStartFiltrer = (event) => {
    if (idTypeDeFiltre === "phone") {
      filterByPhone();
    }
    else if (idTypeDeFiltre === "postal_code") {
      filterByPostalCode();

    }
  };

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-center my-9 text-[25px] font-bold w-[500px]'>
        Filtreur - <span className='text-blue-400 font-bold'>Excel - </span> <span className='font-bold text-orange-600'>Automatique</span>
      </h1>


      {/* ======= CONTAINER BLOC ======= */}
      <div className='flex max-w-[1250px] h-[530px] w-full'>

        {/*  BLOC 1 */}
        <Bloc1
          handleFileSelect={handleFileSelect}
          fichierSelectionner={fichierSelectionner}
          handleFileRemove={handleFileRemove}
          handleClearApp={handleClearApp}
        />


        {/*  BLOC 2 */}
        <Bloc2
          fichierSelectionner={fichierSelectionner}
          listHeadFile={listHeadFile}
          listTypeFiltre={listTypeFiltre}
          enteteDuFichier={enteteDuFichier}
          typeDeFiltre={typeDeFiltre}
          handleClick={handleClick}
          handleFilterClick={handleFilterClick}
        />


        {/*  BLOC 3 */}
        <Bloc3
          enteteDuFichier={enteteDuFichier}
          typeDeFiltre={typeDeFiltre}
          idTypeDeFiltre={idTypeDeFiltre}
          downloadAvailable={downloadAvailable}
          handleDownload={handleDownload}
          loading={loading}
          allFieldsAvailable={allFieldsAvailable}
          filterByPostalCode={filterByPostalCode}
          inputPhoneValue={inputPhoneValue}
          handleOnChangePhone={handleOnChangePhone}
          inputCPvalue={inputCPvalue}
          handleOnChangeCP={handleOnChangeCP}
          fichierDeSortie={fichierDeSortie}
          handleOnChangeFichierDeSortie={handleOnChangeFichierDeSortie}
          handleStartFiltrer={handleStartFiltrer}

        />

      </div>

    </div>
  );
}

export default App;
