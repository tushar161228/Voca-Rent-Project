
const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const ImageWordPressController = require("../core/ImageWordPressController")
const BaseController = require("../core/BaseController");
const config = require('../config');
const auth = require('../controllers/Auth');

const authenticateToken = auth.authenticateToken
const role = auth


const mediaController = new ImageWordPressController(Image, {
    wordpress: config.wordpress,
    quality: { sharpQuality: 80 },
    rootAccessRoles: ["admin"]
})

const publicImageController = new BaseController(Image, {
    access: 'admin',
    get: {
        pagination: config.pagination,
        pre: (filter, req, res) => {
            if (!(req.user.role == 'admin' || req.user.role == 'editor')) {
                filter.createdBy = req.user._id;
                filter.public = true;
            }
        },
        sort: { createdAt: -1 }
    }
});

const privateImageController = new BaseController(Image, {
    access: 'user',
    accessKey: 'createdBy',
    get: {
        pagination: config.pagination,
        sort: { createdAt: -1 }
    }
});



router.post('/multipleUpload', mediaController.uploadBulkImages);
router.post('/upload', mediaController.uploadImage);
// router.post('/public/upload', mediaController.uploadImage);

router.get('/', authenticateToken, privateImageController.get);
router.get('/all', authenticateToken, role.authorizeRole('admin'), publicImageController.getAll);
router.get('/public', authenticateToken, publicImageController.get);
router.delete('/:id', authenticateToken, mediaController.deleteImage);

module.exports = router;
