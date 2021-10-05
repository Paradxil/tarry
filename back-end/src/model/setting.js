var mongoose = require('mongoose');
var timezones = require('timezones-list').default;

const colors = ['gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'];

const possibleSettings = {
    "primary-color": colors,
    "secondary-color": colors,
    "time-zone": timezones.map((tz)=>{return {value: tz.tzCode, text: tz.label}}),
    "hour-format": ["24", "12"],
    "currency-symbol": ["$", "€", "¥"],
    "currency-separator": [",", "."],
    "currency-decimal": [".", ","]
}

// Create a scheme for settings
const settingSchema = new mongoose.Schema({
    userid: {type: String, required: true},
    name: {type: String, required: true, enum: Object.keys(possibleSettings)},
    value: {
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return possibleSettings[this.name].includes(v);
            }
        }
    }
});

// settingSchema.post(('findOne'), async function(doc, next){
//     if(doc == null) {
//         let id = this.getFilter()['_id'];
//         if(id in possibleSettings) {
//             doc = new module.exports({
//                 _id: id,
//                 userid: this.userid,
//                 value: possibleSettings[id][0]
//             });
//             await doc.save();
//         }
//     }
// });

settingSchema.index({ userid: 1, name: 1}, { unique: true });

// Create a model for settings
module.exports = mongoose.model('Settings', settingSchema);