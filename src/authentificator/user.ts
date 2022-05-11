import { Schema, model } from 'mongoose';
import { permissionType } from '../services/permissions/permissionTester';
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    permission: {
        type: String,
        default: 'user',
    },
});

const User = model('User', userSchema);

export interface UserType {
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    permission: permissionType,
};

export default User;
