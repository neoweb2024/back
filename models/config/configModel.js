const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ImgSchema = require("./configSchemas/imgSchema");
const ContactSchema = require("./configSchemas/ContactSchema");
const { defaultStringValue } = require("../../config");
const AuthSchema = require("./configSchemas/authSchema");

const ConfigSchema = new Schema({
    imgsCarrousel: {
        type: [ImgSchema],
        default: [
            {
                name: defaultStringValue,
                url: defaultStringValue
            }
        ]
    },
    logoImage: {
        type: String,
        default: defaultStringValue
    },
    presentationText: {
        type: String,
        default: defaultStringValue
    },
    imagePresentation: {
        type: String,
        default: defaultStringValue
    },
    presentationTitle: {
        type: String,
        default: defaultStringValue
    },
    imageAppointment: {
        type: String,
        default: defaultStringValue
    },
    contact: {
        type: ContactSchema,
        default: {
            name: defaultStringValue,
            phone: defaultStringValue,
            address: defaultStringValue,
            city: defaultStringValue,
            state: defaultStringValue,
            email: defaultStringValue,
            mapPoint: defaultStringValue
        }
    },
    auth: {
        type: AuthSchema,
        default: {
            domain: defaultStringValue,
            clientId: defaultStringValue
        }
    }
});

const ConfigModel = mongoose.model("ConfigSchema", ConfigSchema);

module.exports = { ConfigModel };
