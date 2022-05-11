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
        default: false
    }
});

const ListElement = model('ListElement', listElementSchema);

export interface ListElementType {
    name: string,
    creationTime?: Date,
    listId: string,
    isChecked?: boolean,
    _id?: string
}

export default ListElement;
