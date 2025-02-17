import * as FileSystem from 'expo-file-system';



const processFile = async (uri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (fileInfo.exists) {
      console.log('File info:', fileInfo);
      const fileName = uri.split('/').pop(); 
      const fileExtension = fileName?.split('.').pop(); 
      const mimeType = `image/${fileExtension}`;

      const blob = await (await fetch(uri)).blob(); 
      return {
        uri,
        fileName,
        fileExtension,
        mimeType,
        size: fileInfo.size,
        modificationTime: fileInfo.modificationTime,
        blob
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error processing file:", error);
    return null;
  }
};


const processAllFiles = async () => {

  const filesArray = await Promise.all(images.map(item => processFile(item.path)));

  const validFiles = filesArray.filter(file => file !== null);

  console.log(validFiles);
  return validFiles;
};

processAllFiles();
