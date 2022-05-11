// mongoose model for list
import { Schema, model } from 'mongoose';
const listSchema = new Schema({
    name: {
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
    }
});

const List = model('List', listSchema);

export interface ListType {
    name: string,
    owner: string,
    creationTime?: Date,
    _id?: string
}

export default List;
