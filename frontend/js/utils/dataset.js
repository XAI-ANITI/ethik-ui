export function readColumns(file, cb) {
  if (file.type == "text/csv") return readColumnsFromCSV(file, cb);
  cb([]);
}

function readColumnsFromCSV(file, cb) {
  const reader = new FileReader();
  reader.onabort = () => console.log('file reading was aborted')
  reader.onerror = () => console.log('file reading has failed')
  reader.onload = () => {
    const text = reader.result
    const line = text.split("\n")[0].trim();
    cb(line.split(","));
  }
  reader.readAsText(file)
}
