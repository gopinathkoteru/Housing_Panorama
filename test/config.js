var full_dataset = {};
var house = {
  "0": {
    "title": "",
    "path": "panos/1.tiles/%s/l1/%v/l1_%s_%v_%h.jpg",
    "blur_image_path" : "panos/1.tiles/preview.jpg",
    "side_panel": true,
    "start_position": 37,
    "hotspots": [
      {
        "to_id": 1,
        "angle": 104,
        "error": -92,
        "text": "pano2"
      }
    ],
    "annotations": [
      {
        "lon": 291,
        "lat": -1,
        "title": "white board",
        "desc": "4 X 4"
      }
    ]
  },
  "1": {
    "title": "",
    "path": "panos/2.tiles/%s/l1/%v/l1_%s_%v_%h.jpg",
    "blur_image_path" : "panos/2.tiles/preview.jpg",
    "side_panel": true,
    "start_position": 276,
    "hotspots": [
      {
        "to_id": 0,
        "angle": 210,
        "error": 84,
        "text": "pano1"
      },
      {
        "to_id": 2,
        "angle": 73,
        "error": 72,
        "text": "pano2"
      }
    ],
    "annotations": []
  },
  "2": {
    "title": "",
    "path": "panos/3.tiles/%s/l1/%v/l1_%s_%v_%h.jpg",
    "blur_image_path" : "panos/3.tiles/preview.jpg",
    "side_panel": true,
    "start_position": 276,
    "hotspots": [
      {
        "to_id": 1,
        "angle": 342,
        "error": -100,
        "text": "pano2"
      }
    ],
    "annotations": []
  }
};
// full_dataset ={
//	"panos-house": DirectPano,
//	"panos": DirectPano,
//}

var test_pano = [];
var fallback_pano = [];
var titles = ["Entrance", "Kitchen", "Hall", "Hall", "Hall", "", "Bedroom 1", "Bedroom 1", "Bedroom 1", "Bedroom 1", "Bathroom 1", "", "", "Bedroom 3", "Bedroom 3", "Bathroom 3", "Bedroom 3", "Bedroom 3", "Bedroom 2", "Bathroom 2", "Bedroom 2", "Bedroom 2"];
var side_panel = [true, true, false, true, false, false, true, false, false, false, true, false, false, true, false, true, false, false, true, true, false, false];
for(var i=0;i<22;i++)
{
    test_pano[i] = [titles[i], "./Dataset/panos-house/" + (i + 1) + "/%s/%h_%v.jpg", side_panel[i],0];
    fallback_pano[i] = "./Dataset/panos-house/" + (i + 1) + '/';
}
var DirectPano = 
{
	//hotspots_angle : [[[1, 70, -26, "Kitchen"], [2, 340, -21, "Hall Entrance"]], [[0, 225, 0, "Main Door"]], [[0, 140, 0, "Main Door"], [3, 0, 0, "Hall Center"]], [[2, 190, 0, "Hall Entrance"], [4, 330, 0, "Hall Window"], [5, 53, 0]], [[3, 135, 0, "Hall Center"], [9, 332, 0]], [[3, 222, 0, "Hall Center"], [6, 315, 0, "Bedroom 1"], [11, 47, 0]], [[5, 120, 0], [7, 210, 0], [8, 295, 0]], [[6, 25, 0, "Bedroom 1"]], [[6, 123, 0, "Bedroom 1"], [9, 220, 0]], [[8, 70, 0], [4, 177, 0, "Hall Window"]], [[11, 340, 0]], [[12, 320, 0], [5, 230, 0], [10, 170, 0, "Bathroom 1"]], [[11, 135, 0], [13, 45, 0, "Bedroom 3"], [18, 313, 0, "Bedroom 2"]], [[12, 245, 0], [14, 130, 0], [16, 63, 0]], [[13, 305, 0, "Bedroom 3"], [15, 145, 0, "Bathroom 3"]], [[14, 305, 0]], [[13, 220, 0, "Bedroom 3"], [17, 75, 0]], [[16, 255, 0]], [[12, 130, 0], [19, 328, 0, "Bathroom 2"], [20, 10, 0]], [[18, 135, 0, "Bedroom 2"]], [[18, 182, 0, "Bedroom 2"], [21, 40, 0]], [[20, 215, 0]]],
	pano_div_id : "container",
	image_div_id : "fullscreen-image",
	initial_width : 490,
	initial_height : 336,
	
	fallback_pano : fallback_pano,
	house : house

};

