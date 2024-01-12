import mongoose, { mongo } from "mongoose";
import random from "random-string-generator";
import date from 'date-and-time';

const now = new Date();

const TicketsCollection = 'tickets';

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        default: random()
    },
    purchase_datetime: {
        type: Date,
        default: date.format(now, 'YYYY/MM/DD HH:mm:ss')
    }, 
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
})


const ticketsModel = mongoose.model(TicketsCollection, ticketsSchema)

export { ticketsModel }