import mongoose from 'mongoose'

const whatsappScheme = mongoose.Schema({
    message:String,
    name: String,
    timestamp: String,
    received: Boolean,
})

export default mongoose.model('messagecontent',whatsappScheme)
//                              name                schema