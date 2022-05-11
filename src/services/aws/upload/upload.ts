// upload data to aws s3

import { S3 } from 'aws-sdk';
import { Request, Response } from 'express';
import multer = require( 'multer' );
import multerS3 = require( 'multer-s3' );
import { Router } from 'express';

export const routerFiles = Router();

// it seems correct but my files are not uploaded to aws s3 nor downloaded from aws s3

const s3 = new S3({
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID||'123',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY||'123',
    },
    endpoint: process.env.AWS_ENDPOINT||'localhost:4572',
    region: process.env.AWS_REGION||'us-east-1',
});
const uploadFile = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET||'files',
        acl: 'public-read',
        metadata: (_req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (_req, file, cb) => {
            cb(null, file.originalname);
        }
    })
}).single('file');
export const upload = (req: Request, res: Response) => {

    uploadFile(req, res, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: 'Something went wrong'
            })
        } else {
            res.status(200).json({
                message: 'File uploaded successfully',
                file: req.file
            })
        }
    })
}

routerFiles.post('/', upload);

// download data from aws s3

export const download = (req: Request, res: Response) => {
    const fileName = req.headers.filename as string;
    const params = {
        Bucket: process.env.AWS_BUCKET||'files',
        Key: fileName
    };
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: 'Something went wrong'
            })
        } else {
            res.status(200).json({
                message: 'File downloaded successfully',
                data
            })
        }
    })
}

routerFiles.get('/', download);

