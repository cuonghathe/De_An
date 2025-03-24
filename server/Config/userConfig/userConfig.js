import multer from 'multer';


//storage config
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    const filename = `image-${Date.now()}.${file.originalname}`
    callback(null, filename)
  }
});

//filter
const fileFilter = (req, file, callback) => {
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    callback(null, true)
  } else {
    callback(null, false)
    return callback(new Error("chỉ dùng file: .jpg, .jpeg, .png"))
  }
}

const userUpload = multer({
  storage: storage,
  fileFilter: fileFilter
});

export default userUpload;