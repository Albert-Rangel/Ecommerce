import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    age: Number,
    email: {
        type: String,
        unique: true,
        dropDups: true,
        required: true,
        index: true,
    },
    password: String,
    cart: {
        type: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carts',
                }
            }
        ], default: null
    },
    role: {
        type: String,
    },
    lastConnection: {
        type: Date,
        default: Date.now,
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                    required: false,
                },
                reference: {
                    type: String,
                    required: false,
                }
            }
        ], default: []
    },
    status: {
        type: Boolean,
        default: false
    },
    
});

const userModel = mongoose.model(userCollection, userSchema);

export { userModel };

