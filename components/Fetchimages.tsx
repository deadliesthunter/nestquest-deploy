import * as FileSystem from 'expo-file-system';

const images = [ 
  // Your given array here
];

// Function to process each file
const processFile = async (uri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (fileInfo.exists) {
      console.log('File info:', fileInfo);

      const fileName = uri.split('/').pop(); 
      const fileExtension = fileName?.split('.').pop(); 
      const mimeType = `image/${fileExtension}`;

      const blob = await (await fetch(uri)).blob(); // Fetching as blob

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

// Process all images asynchronously
const processAllFiles = async () => {
  const filesArray = await Promise.all(images.map(item => processFile(item.path)));
  
  // Filter out any null values (files that don't exist)
  const validFiles = filesArray.filter(file => file !== null);

  console.log(validFiles);
  return validFiles;
};

// Run the function
processAllFiles();
