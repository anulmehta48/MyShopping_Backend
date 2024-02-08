import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, file.fieldname === "profileImage" ? "./public/profile_images" : "./public/product_images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

export const uploadProfileImage = upload.single("profileImage");
export const uploadProductImage = upload.single("productImage");

