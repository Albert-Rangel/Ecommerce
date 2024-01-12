import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products";

const produtsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    code: {
        type: String,
        unique: true,
        dropDups: true,
        required: true,
        index: true,

    },
    stock: {
        type: Number,
        required: true,
        index: true,

    },
    status: {
        type: Boolean,
        required: true,
    },
    category: {
        type: String,
        required: true,
        index: true,

    },
    owner: {
        type: String,
        default: "admin"
    },
})
produtsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, produtsSchema);

export { productsModel }