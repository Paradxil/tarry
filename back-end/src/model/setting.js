var mongoose = require('mongoose');

const colors = ['gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'];

const possibleSettings = {
    "primary-color": colors,
    "secondary-color": colors,
    
}

// Create a scheme for settings
const settingSchema = new mongoose.Schema({
    userid: {type: String, required: true},
    name: {type: String, required: true, enum: Object.keys(possibleSettings)},
    value: {
        type: Number, 
        required: true,
        validate: {
            validator: function(v) {
                possibleSettings[this.name].includes(v);
            }
        }
    }
});


// Create a model for settings
module.exports = mongoose.model('Settings', settingSchema);