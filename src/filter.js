import * as XLSX from 'xlsx';
// import fileDownload from 'js-file-download';




export function filterExcel(fileList, filterValues, code, outputFilename) {
  const inputFiles = fileList;
  const outputFile = outputFilename;

  function filtrerDonnees(inputFile, isFirstFile) {
    const workbook = XLSX.readFile(inputFile);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convertir les données en format JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const colonneCP = jsonData[0].indexOf(code);

    // Tableau des codes postaux de référence pour le filtrage
    const codesPostaux = filterValues;

    // Filtrer les lignes selon les critères
    const lignesFiltrees = jsonData.filter((ligne, index) => {
      if (index === 0 && isFirstFile) {
        return true; // Conserver l'en-tête uniquement pour le premier fichier
      } else {
        const codePostal = String(ligne[colonneCP]);
        return codesPostaux.some(
          (cp) =>
            codePostal.startsWith(cp[0] === '0' ? cp[1] : cp) &&
            (cp[0] === '0' ? codePostal.length === 4 : codePostal.length === 5)
        );
      }
    });

    return lignesFiltrees;
  }

  // Tableau pour stocker les résultats filtrés de chaque fichier
  const resultatsFiltres = [];

  // Parcourir chaque fichier et filtrer les données
  inputFiles.forEach((inputFile, index) => {
    const isFirstFile = index === 0;
    const lignesFiltrees = filtrerDonnees(inputFile, isFirstFile);
    resultatsFiltres.push(lignesFiltrees);
  });

  // Fusionner tous les résultats filtrés en une seule liste
  const lignesFiltreesFinales = resultatsFiltres.flat();

  // Créer une nouvelle feuille de calcul avec les lignes filtrées
  const newWorksheet = XLSX.utils.aoa_to_sheet(lignesFiltreesFinales);

  // Créer un nouveau classeur Excel avec la nouvelle feuille de calcul
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Résultats');

  // Enregistrer le fichier Excel de résultats
  XLSX.writeFile(newWorkbook, outputFile);

  // Déclencher le téléchargement du fichier généré
  const fileData = XLSX.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' });
  fileDownload(fileData, outputFile);

  console.log('Fichier de résultats créé avec succès.');
}
