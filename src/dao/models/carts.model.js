import mongoose, { mongo } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2" 

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
   
    products: {
        type: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ], default: []
    },
})
cartsSchema.plugin(mongoosePaginate);

cartsSchema.pre("find", function () {
    this.populate("products.id")
})



const cartsModel = mongoose.model(cartsCollection, cartsSchema)

export { cartsModel }