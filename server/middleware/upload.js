const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../utils/cloudinary')
const path = require('path')

// Workaround to force `type: 'upload'`
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const nameWithoutExt = path.parse(file.originalname).name
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_')
    const filename = `${Date.now()}-${cleanName}.pdf`

    return {
      folder: 'resumes',
      resource_type: 'raw',
      public_id: filename,
      type: 'upload', // ✅ Force public access
    }
  },
})

const upload = multer({ storage })

module.exports = upload
