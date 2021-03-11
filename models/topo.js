var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;

var TopoSchema = new Schema({
  content: { type: String },
  key: { type: String },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false},
});

TopoSchema.plugin(BaseModel);

mongoose.model('Topo', TopoSchema);
