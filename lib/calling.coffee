root = require("./listeners.js")

root.Hotspot.init(DirectPano.hotspots_angle)
root.Transition.init(DirectPano.pano_path) 
root.Hotspot.add_hotspots(0)