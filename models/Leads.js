const mongoose = require("mongoose");
const { dateToString } = require("../utils/dateHelper");

const schema = new mongoose.Schema({
  date: {
    type: String,
    default: dateToString(new Date()),
  },
  profile_id: {
    type: String,
    unique: true,
  },
  looking_for: {
    type: String,
    required: true,
    default: "",
  },
  contact_person: {
    type: String,
    required: true,
    default: "",
  },
  designation: {
    type: String,
    required: false,
    default: "",
  },
  default_phone: {
    type: String,
    required: true,
    default: "",
  },
  alt_phone: {
    type: String,
    default: "",
    required: false,
  },
  phone3: {
    type: String,
    default: "",
    required: false,
  },
  phone4: {
    type: String,
    default: "",
    required: false,
  },
  email: {
    type: String,
    required: true,
    default: "",
  },
  email2: {
    type: String,
    required: false,
    default: "",
  },
  office_contact_person: {
    type: String,
    required: false,
    default: "",
  },
  office_designation: {
    type: String,
    required: false,
    default: "",
  },
  office_default_phone: {
    type: String,
    required: false,
    default: "",
  },
  office_alt_phone: {
    type: String,
    default: "",
    required: false,
  },
  office_phone3: {
    type: String,
    default: "",
    required: false,
  },
  office_phone4: {
    type: String,
    default: "",
    required: false,
  },
  office_email: {
    type: String,
    required: false,
    default: "",
  },
  office_email2: {
    type: String,
    required: false,
    default: "",
  },
  alt_contact_person: {
    type: String,
    required: false,
    default: "",
  },
  alt_designation: {
    type: String,
    required: false,
    default: "",
  },
  alt_default_phone: {
    type: String,
    required: false,
    default: "",
  },
  alt_alt_phone: {
    type: String,
    default: "",
    required: false,
  },
  alt_phone3: {
    type: String,
    default: "",
    required: false,
  },
  alt_phone4: {
    type: String,
    default: "",
    required: false,
  },
  alt_email: {
    type: String,
    required: false,
    default: "",
  },
  alt_email2: {
    type: String,
    required: false,
    default: "",
  },
  source: {
    type: String,
    default: "",
  },
  status: {
    type: Number,
    default: 0,
  },
  company_name: {
    type: String,
    required: true,
    default: "",
  },
  city: {
    type: String,
    required: true,
    default: "",
  },
  state: {
    type: String,
    required: false,
    default: "",
  },
  message: {
    type: String,
    required: true,
    default: "",
  },
  query_status: {
    type: String,
    required: true,
    default: "",
  },
  prefil_score: {
    type: Number,
  },
  allocated_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Adminauth",
  },
  assign_to_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  assign_to_distributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Distributor",
    default: null,
  },
  abt_company: {
    type: String,
    default: "",
  },
  company_type: {
    type: String,
    default: "",
  },
  est_year: {
    type: String,
    default: "",
  },
  business_nature: {
    type: String,
    default: "",
  },
  turn_over: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  address_phone: {
    type: String,
    default: "",
  },
  pincode: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  gst_num: {
    type: String,
    default: "",
  },
  employee_count: {
    type: String,
    default: "",
  },
  link1: {
    type: String,
    default: "",
  },
  link2: {
    type: String,
    default: "",
  },
  link3: {
    type: String,
    default: "",
  },
  link4: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  fb: {
    type: String,
    default: "",
  },
  linkdin: {
    type: String,
    default: "",
  },
  insta: {
    type: String,
    default: "",
  },
  yt: {
    type: String,
    default: "",
  },
  quora: {
    type: String,
    default: "",
  },
  next_call: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  subdescription: {
    type: String,
    default: "",
  },
  brand_name: {
    type: String,
    default: "",
  },
  remarks: {
    type: String,
    default: "",
  },
  followup_date: {
    type: String,
    default: "",
  },
  product_name: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    default: "",
  },
  billing_gst_num: {
    type: String,
    default: "",
  },
  billing_email: {
    type: String,
    default: "",
  },
  billing_phone: {
    type: String,
    default: "",
  },
  billing_phone2: {
    type: String,
    default: "",
  },
  billing_period: {
    type: String,
    default: "",
  },
  billing_contract_type: {
    type: String,
    default: "",
  },
  received_amount: {
    type: String,
    default: "",
  },
  total_contract_value: {
    type: String,
    default: "",
  },

  products: [
    {
      product_name: {
        type: String,
        default: "",
      },
      category: {
        type: String,
        default: "",
      },
      keywords: {
        type: String,
        default: "",
      },
    },
  ],
  profileImage: {
    path: String,
    filename: String,
  },
  activities: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      followup_date: {
        type: String,
      },
      description: {
        type: String,
        trim: true,
        default: "",
      },
      subdescription: {
        type: String,
        trim: true,
        default: "",
      },
      product_name: {
        type: String,
        trim: true,
        default: "",
      },
      price: {
        type: String,
        trim: true,
        default: "",
      },
      remarks: {
        type: String,
        trim: true,
        default: "",
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});
module.exports = mongoose.model("Leads", schema);
