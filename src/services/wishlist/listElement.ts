// element of a list
import { Schema, model } from 'mongoose';
const listElementSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    creationTime: {
        type: Date,
        default: Date.now
    },
    listId: {
        type: String,
        required: true
    },
    isChecked: {
        type: Boolean,
        default: true
    }, 
    imageUrl: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

const ListElement = model('ListElement', listElementSchema);

export interface ListElementType {
    name: string,
    creationTime?: Date,
    owner: string,
    listId: string,
    imageUrl: string,
    logoUrl: string,
    description: string,
    isChecked?: boolean,
    url: string,
    _id?: string
}

export default ListElement;
