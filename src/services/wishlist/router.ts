import express from 'express';
import { Request, Response } from 'express';

import List, { ListType } from './list';
import ListElement, { ListElementType } from './listElement';

import verify from '../../authentificator/verifier';

const router = express.Router();

router.use(verify);

router.get('/', async (req: Request, res: Response) => {
    try {
        const lists = await List.find({ owner: req.body.user.user }).sort({"creationTime": "desc"}) as ListType[];
        res.status(200).json({
            lists
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});

router.get('/:id', async (req: Request, res: Response) => {
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

router.post('/list', async (req: Request, res: Response) => {
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

router.post('/list/:id/element', async (req: Request, res: Response) => {
    const listId = req.params.id as string;
    const list = await List.findById(listId) as ListType;
    const user = req.body.user.username as string;
    const link = req.body.link as string;
    try {
        if (!list) {
            res.status(404).json({
                error: 'List not found'
            })
        } else {
            if (list.owner === user) {
                // metascrapper is not implemented yet
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

router.delete('/list/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = req.body.user.username as string;
    const list = await List.findOne({ _id: id, owner: user }) as ListType;
    try {
        if (!list) {
            res.status(404).json({
                error: 'List not found'
            })
        } else {
            if (list.owner === user) {
                await List.deleteOne({ _id: id });
                await ListElement.deleteMany({ listId: id})
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

router.put('/:id', async (req: Request, res: Response) => {
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




