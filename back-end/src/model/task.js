var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// Create a schema for tasks
const taskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    userid: {type: String, required: true},
    status: {type: String, required: true, enum: ["untracked", "todo", "completed"], default: "untracked"},
    project: {        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        autopopulate: true
    }
});

taskSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['name']});

taskSchema.plugin(require('mongoose-autopopulate'));

//Check for duplicates
// taskSchema.pre('validate', async function() {
//     let tasks = await this.constructor.find({userid: this.userid});

//     for(let t of tasks) {
//         if(t.name === this.name && t.project === this.project && t.userid === this.userid && !t._id.equals(this._id)) {
//             console.log(t._id);
//             console.log(this._id);
//             throw {message: "Task already exists.", taskid: t._id};
//         }
//     }
// });

// Create a model for tasks
module.exports = mongoose.model('Tasks', taskSchema);