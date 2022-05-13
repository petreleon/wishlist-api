import express = require( 'express' );
import { Request, Response } from 'express';

import List, { ListType } from './list';
import ListElement, { ListElementType } from './listElement';

import verify from '../../authentificator/verifier';

import metascraper = require( "metascraper" );
import metascraper_image = require( "metascraper-image" );
import metascraper_title = require( "metascraper-title" );
import metascraper_url = require( "metascraper-url" );
import metascraper_description = require( "metascraper-description" );
import metascraper_logo_favicon = require( "metascraper-logo-favicon" );

import got from "got";
const meta_any = metascraper as any;

const meta = meta_any([
    metascraper_title(),
    metascraper_url(),
    metascraper_description(),
    metascraper_image(),
    metascraper_logo_favicon()
]);

function ownerOnly(owner: string, user: string, req: Request, res: Response, next: (req: Request, res: Response) => void) {
    if (owner === user) {
        next(req, res);
    } else {
        res.status(403).send({
            error: 'You are not allowed to access this resource'
        });
    }
}

const private_router = express.Router();
const router = express.Router();

router.use(private_router)
private_router.use(verify);

private_router.get('/', async (req: Request, res: Response) => {
    try {
        const lists = await List.find({ owner: req.body.user.username }).sort({"creationTime": "desc"}) as ListType[];
        res.status(200).json({
            lists
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});

router.get('/list/:id', async (req: Request, res: Response) => {
    try {
        const list = await List.findById(req.params.id) as ListType;
        const elements = await ListElement.find({ list: list._id }).sort({"creationTime": "asc"}) as ListElementType[];
        res.status(200).json({
            list,
            elements
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});

private_router.post('/list', async (req: Request, res: Response) => {
    const name = req.body.name as string; 
    const user = req.body.user.username as string;
    const listToCreate = { name, owner: user } as ListType;
    try {
        const list = await List.create(listToCreate) as ListType;
        res.status(201).json({
            list
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});

private_router.delete('/listelement/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const ElementToDelete = await ListElement.findById(id) as ListElementType;
        ownerOnly(ElementToDelete.owner, req.body.user.username, req, res, (_req, res) => {
            ListElement.deleteOne({ _id: id }, (err) => {
                if (err) {
                    res.status(500).json({
                        error: err               
                    })
                } else {
                    res.status(200).json({    
                        message: 'Element deleted'
                    })
                }
            });
        });
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});

private_router.put('/changechecked/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const ElementToUpdate = await ListElement.findById(id) as ListElementType;
        ownerOnly(ElementToUpdate.owner, req.body.user.username, req, res, (_req, res) => {
            ListElement.updateOne({ _id: id }, { $set: { isChecked: !ElementToUpdate.isChecked } }, (err) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    })
                } else {
                    res.status(200).json({
                        message: 'Element updated'
                    })
                }
            });
        });
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});

private_router.post('/list/:id/element', async (req: Request, res: Response) => {
    const listId = req.params.id as string;
    const list = await List.findById(listId) as ListType;
    const user = req.body.user.username as string;
    const link = req.body.link as string;
   
    try {
        const {body: html, url } = await got(link)
        const metadata = await meta({html, url}) as any;
        if (!list) {
            res.status(404).json({
                error: 'List not found'
            })
        } else {
            if (list.owner === user) {
                const elementToCreate = {
                    name: metadata.title as string,
                    description: metadata.description as string,
                    owner: user,
                    listId: list._id,
                    isChecked: false,
                    imageUrl: metadata.image as string,
                    logoUrl: metadata.logo as string
                } as ListElementType;
                const element = await ListElement.create(elementToCreate) as ListElementType;
                res.status(201).json({
                    element
                })
            } else {
                res.status(403).json({
                    error: 'You are not the owner of this list'
                })
            }
        }
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});

private_router.post("/search", async (req: Request, res: Response) => {
    const query = req.body.query as string;
    try {
        const lists = await List.find({$and: [{ name: { $regex: query, $options: 'i' } }, { owner: req.body.user.username }]}).sort({"creationTime": "desc"}) as ListType[];
        const elements = await ListElement.find({$and: [{$or: [{ name: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }]}, { owner: req.body.user.username }]}).sort({"creationTime": "asc"}) as ListElementType[];
        res.status(200).json({
            lists,
            elements
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});

private_router.delete('/list/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = req.body.user.username as string;
    const list = await List.findOne({ _id: id }) as ListType;
    try {
        if (!list) {
            res.status(404).json({
                error: 'List not found'
            })
        } else {
            if (list.owner === user) {
                await List.deleteOne({ _id: id });
                await ListElement.deleteMany({ listId: id })
                res.status(200).json({
                    message: 'List deleted'
                })
            } else {
                res.status(403).json({
                    error: 'You are not the owner of this list'
                })
            }
        }
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});

private_router.put('/list/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const name = req.body.name as string;
    const listbyId = await List.findById(id) as ListType;
    if (listbyId.owner === req.body.user.username) {
        const listToUpdate = { name, owner: req.body.user.username } as ListType;
        try {
            const list = await List.findByIdAndUpdate(id, listToUpdate, { new: true }) as ListType;
            res.status(200).json({
                list
            })
        } catch (err) {
            res.status(500).json({
                error: err
            })
        }
    } else {
        res.status(401).json({
            error: 'You are not the owner of this list'
        })
    }
});


export default router;

