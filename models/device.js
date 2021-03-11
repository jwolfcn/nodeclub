var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;

var DeviceSchema = new Schema({
  name: { type: String },
  ip: { type: String },
  host_id:{type: String},
  chart_key: { type: String },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false},
});

DeviceSchema.plugin(BaseModel);

mongoose.model('Device', DeviceSchema);
