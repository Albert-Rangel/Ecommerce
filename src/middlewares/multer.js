import multer from 'multer';

function folderName(file) {

  let name  = file.fieldname == "profileFile" ? "profiles" : file.fieldname == "productsFile" ? "products" : "documents"
  return name
}
function fileName(name, field,  id) {
  
  let filename  = name.split('.')
  console.log(filename)

  let finalname = field + "," + id + "." + filename[1]
  return finalname
}
const storage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, `./src/public/` + folderName(file)),
  filename: (req, file, cb) => cb(null, fileName(file.originalname , file.fieldname, req.user._id) ),
});


export const uploader = multer({ storage })