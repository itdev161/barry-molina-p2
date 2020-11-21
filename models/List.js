import mongoose from 'mongoose';

const ListItemSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true
    },
    url: {
        type: String,
    }
})

const ListSchema = new mongoose.Schema({
    user: { 
        type: 'ObjectId', 
        ref: 'User',
        required: true 
    },
    title: {
        type: String,
        required: true
    },
    items: [ListItemSchema]
})

const List = mongoose.model('list', ListSchema);

export default List;
