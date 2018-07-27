const mongoose = require("mongoose");

const wordSchema = mongoose.Schema({
        owner: {type: String, required: true},
        text: {type: String, required: true}
    }, {
        timeStampes: {createdAt: "created_at"
    }
});

module.exports = mongoose.model("Word", wordSchema);