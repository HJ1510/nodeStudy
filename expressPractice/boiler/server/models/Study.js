const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      // required: true,
    },
    maxNum: {
      type: Number,
      // required: true,
    },
    types: {
      writing: {
        type: Boolean,
        // required: true,
      },
      discussion: {
        type: Boolean,
        // required: true,
      },
    },
    hashtags: {
      type: [String],
      // required: true,
    },
    location: {
      type: String,
      // required: true,
    },
    category: {
      novel: {
        type: Boolean,
        // required: true,
      },
      poem: {
        type: Boolean,
        // required: true,
      },
      science: {
        type: Boolean,
        // required: true,
      },
    },
    genderOpened: {
      type: Boolean,
      default: false,
      // required: true,
    },
    ageOpened: {
      type: Boolean,
      default: false,
      // required: true,
    },
    introduce: {
      type: String,
      // required: true,
    },
    firstDate: {
      type: String,
      // required: true,
    },
    imgFile: {
      type: Buffer,
    },
  },
  { timestamp: true }
);

const Meeting = mongoose.model('Study', meetingSchema);

module.exports = { Meeting };
