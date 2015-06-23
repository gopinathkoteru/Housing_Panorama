/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.3
	(function() {
	  var anim, root;

	  root = void 0;

	  anim = void 0;

	  DirectPano.show_pano = function() {
	    root = __webpack_require__(1);
	    root.scene.children.length = 0;
	    anim = new root.animation();
	    root.add_listeners();
	    root.Hotspot = new root.hotspot(DirectPano.hotspots_angle);
	    root.Transition = new root.transition(DirectPano.pano_path, DirectPano.hotspots_angle);
	    root.Hotspot.add_hotspots(0);
	  };

	  DirectPano.remove_pano = function() {
	    anim.destroy = true;
	    anim = null;
	    root.remove_listeners();
	    root.Hotspot.destroy_hotspot();
	    root.Hotspot = null;
	    root.Transition.destroy_transition();
	    root.Transition = null;
	    root.destroy();
	  };

	}).call(this);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.3
	(function() {
	  var add_listeners, keyMax, keySpeed, onPointerDownLat, onPointerDownLon, onPointerDownPointerX, onPointerDownPointerY, on_key_down, on_key_up, on_mouse_down, on_mouse_move, on_mouse_up, on_mouse_wheel, remove_listeners, root, touch_handler;

	  root = __webpack_require__(2);

	  onPointerDownPointerX = void 0;

	  onPointerDownPointerY = void 0;

	  onPointerDownLon = void 0;

	  onPointerDownLat = void 0;

	  keyMax = 7;

	  keySpeed = 2;

	  touch_handler = function(event) {
	    var first, simulatedEvent, touches, type;
	    touches = event.changedTouches;
	    first = touches[0];
	    type = '';
	    switch (event.type) {
	      case 'touchstart':
	        type = 'mousedown';
	        break;
	      case 'touchmove':
	        type = 'mousemove';
	        break;
	      case 'touchend':
	        type = 'mouseup';
	        break;
	      default:
	        return;
	    }
	    simulatedEvent = document.createEvent('MouseEvent');
	    simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
	    first.target.dispatchEvent(simulatedEvent);
	    event.preventDefault();
	  };

	  on_mouse_down = function(event) {
	    var container, intersects, vector;
	    event.preventDefault();
	    root.Config.isUserInteracting = true;
	    onPointerDownPointerX = event.clientX;
	    onPointerDownPointerY = event.clientY;
	    onPointerDownLon = root.Config.lon;
	    onPointerDownLat = root.Config.lat;
	    vector = new THREE.Vector3;
	    container = document.getElementById('container');
	    vector.set(event.clientX / container.offsetWidth * 2 - 1, -(event.clientY / container.offsetHeight) * 2 + 1, 0.5);
	    vector.unproject(root.camera);
	    root.raycaster.set(root.camera.position, vector.sub(root.camera.position).normalize());
	    intersects = root.raycaster.intersectObjects(root.scene.children, true);
	    if (intersects.length > 0 && intersects[0].object.name === 'hotspot') {
	      root.Transition.start(intersects[0].object.hotspot_id);
	    }
	  };

	  on_mouse_move = function(event) {
	    var mouseSpeed;
	    if (root.Config.isUserInteracting === true) {
	      mouseSpeed = 0.3;
	      root.Config.lon = (onPointerDownPointerX - event.clientX) * mouseSpeed + onPointerDownLon;
	      root.Config.lat = (event.clientY - onPointerDownPointerY) * mouseSpeed + onPointerDownLat;
	    }
	  };

	  on_mouse_up = function(event) {
	    root.Config.isUserInteracting = false;
	    root.Config.stop_time = Date.now();
	    root.Config.autoplay = false;
	  };

	  on_mouse_wheel = function(event) {
	    if (event.wheelDeltaY) {
	      root.camera.fov -= event.wheelDeltaY * 0.05;
	    } else if (event.wheelDelta) {
	      root.camera.fov -= event.wheelDelta * 0.05;
	    } else if (event.detail) {
	      root.camera.fov += event.detail * 1.0;
	    }
	    root.camera.fov = Math.max(60, Math.min(90, root.camera.fov));
	    root.camera.updateProjectionMatrix();
	  };

	  on_key_down = function(event) {
	    var container, keyPressed, near_id;
	    near_id = void 0;
	    if (!event) {
	      event = window.event;
	    }
	    root.Config.isUserInteracting = true;
	    keyPressed = event.keyCode;
	    if (keyPressed === 37) {
	      root.Config.lon -= keySpeed;
	    } else if (keyPressed === 39) {
	      root.Config.lon += keySpeed;
	    } else if (keyPressed === 38) {
	      if (root.Transition.moving === false) {
	        near_id = root.Hotspot.front_nearest_hotspot(root.Transition.current_pano);
	        if (near_id !== -1) {
	          root.Transition.start(near_id);
	        }
	      }
	    } else if (keyPressed === 40) {
	      if (root.Transition.moving === false) {
	        near_id = root.Hotspot.back_nearest_hotspot(root.Transition.current_pano);
	        if (near_id !== -1) {
	          root.Transition.start(near_id);
	        }
	      }
	    } else if (keyPressed === 27) {
	      container = document.getElementById(DirectPano.pano_div_id);
	      if (container.style.width === window.innerWidth + 'px' && (container.style.height = window.innerHeight + 'px')) {
	        root.escape_fullscreen();
	      }
	    }
	    if (root.Config.isUserInteracting === true) {
	      if (keySpeed < keyMax) {
	        keySpeed += 1;
	      }
	    }
	  };

	  on_key_up = function(event) {
	    root.Config.isUserInteracting = false;
	    keySpeed = 2;
	    root.Config.stop_time = Date.now();
	    root.Config.autoplay = false;
	  };

	  add_listeners = function() {
	    return $("#" + DirectPano.pano_div_id).on({
	      click: function(event) {
	        $("#" + DirectPano.pano_div_id).focus();
	      },
	      mousedown: function(event) {
	        on_mouse_down(event);
	      },
	      mousemove: function(event) {
	        on_mouse_move(event);
	      },
	      mouseup: function(event) {
	        on_mouse_up(event);
	      },
	      mousewheel: function(event) {
	        on_mouse_wheel(event.originalEvent);
	      },
	      DOMMouseScroll: function(event) {
	        on_mouse_wheel(event.originalEvent);
	      },
	      touchstart: function(event) {
	        touch_handler(event.originalEvent);
	      },
	      touchmove: function(event) {
	        touch_handler(event.originalEvent);
	      },
	      touchend: function(event) {
	        touch_handler(event.originalEvent);
	      },
	      keydown: function(event) {
	        on_key_down(event);
	      },
	      keyup: function(event) {
	        on_key_up(event);
	      }
	    });
	  };

	  remove_listeners = function() {
	    $("#" + DirectPano.pano_div_id).off();
	  };

	  root.add_listeners = add_listeners;

	  root.remove_listeners = remove_listeners;

	  module.exports = root;

	}).call(this);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.3
	(function() {
	  var root, transition;

	  root = __webpack_require__(3);

	  transition = (function() {
	    function transition(path, hotspot_angles) {
	      this.path = path;
	      this.current_pano = 0;
	      this.moving = false;
	      this.hotspot_angles = hotspot_angles;
	      this.destroy = false;
	      root.clear_images = {};
	      root.blur_images = {};
	      root.clear_images[this.current_pano] = [];
	      path = path + (this.current_pano + 1) + "/mobile_";
	      this.blur_pano = new root.Pano(0, true);
	      this.clear_pano = new root.Pano(0, false);
	      this.blur_pano.create_pano(path, 0.0);
	      this.clear_pano.create_pano(path, 1.0);
	      this.preload_images();
	      return;
	    }

	    transition.prototype.save_clear_images = function() {
	      var current_pano, i, path;
	      current_pano = this.current_pano;
	      path = this.path;
	      if (!root.clear_images[current_pano]) {
	        path = path + (current_pano + 1) + "/mobile_";
	        root.clear_images[current_pano] = [];
	        i = 0;
	        while (i < 6) {
	          (function() {
	            var image, image_index, texture;
	            texture = new THREE.Texture(root.texture_placeholder);
	            image_index = i;
	            image = new Image();
	            image.onload = function() {
	              image.onload = null;
	              texture.image = this;
	              texture.needsUpdate = true;
	              root.clear_images[current_pano][image_index] = image;
	            };
	            image.src = path + root.Config.img_name[i] + ".jpg";
	          })();
	          i++;
	        }
	      }
	    };

	    transition.prototype.preload_images = function() {
	      var current_pano, hotspot_angles, i, path;
	      i = 0;
	      current_pano = this.current_pano;
	      hotspot_angles = this.hotspot_angles;
	      path = this.path;
	      while (i < hotspot_angles[current_pano].length) {
	        (function() {
	          var fpath, j, pano_id;
	          pano_id = hotspot_angles[current_pano][i][0];
	          if (!root.blur_images[pano_id]) {
	            root.blur_images[pano_id] = [];
	            fpath = path + "blur_" + (pano_id + 1) + "/mobile_";
	            j = 0;
	            while (j < 6) {
	              (function() {
	                var image, image_index, texture;
	                texture = new THREE.Texture(root.texture_placeholder);
	                image_index = j;
	                image = new Image();
	                image.onload = function() {
	                  image.onload = null;
	                  texture.image = this;
	                  texture.needsUpdate = true;
	                  root.blur_images[pano_id][image_index] = image;
	                };
	                image.src = fpath + root.Config.img_name[j] + ".jpg";
	              })();
	              j++;
	            }
	          }
	        })();
	        i++;
	      }
	    };

	    transition.prototype.start = function(hotspot_id) {
	      var current_pano, dist, hotspot_angle, old_pano_to_blur_pano, pano_id, rotate_angle;
	      current_pano = this.current_pano;
	      pano_id = this.hotspot_angles[current_pano][hotspot_id][0];
	      hotspot_angle = this.hotspot_angles[current_pano][hotspot_id][1];
	      dist = this.hotspot_angles[current_pano][hotspot_id][2];
	      this.moving = true;
	      this.current_pano = pano_id;
	      this.save_clear_images();
	      rotate_angle = this.find_rotation_angle(hotspot_angle);
	      root.Hotspot.remove_hotspots();
	      old_pano_to_blur_pano = this.old_pano_to_blur_pano.bind(this);
	      this.preload_images();
	      this.load_blur_pano(dist, hotspot_angle).done(function() {
	        old_pano_to_blur_pano(dist, hotspot_angle, rotate_angle);
	      });
	    };

	    transition.prototype.find_rotation_angle = function(hotspot_angle) {
	      var rotate_angle;
	      rotate_angle = hotspot_angle - root.Config.lon;
	      while (rotate_angle > 180) {
	        rotate_angle = rotate_angle - 360;
	      }
	      while (rotate_angle < -180) {
	        rotate_angle = rotate_angle + 360;
	      }
	      if (rotate_angle > 50) {
	        rotate_angle = (rotate_angle - 180) % 360;
	      } else if (rotate_angle < -50) {
	        rotate_angle = (rotate_angle + 180) % 360;
	      }
	      rotate_angle = rotate_angle + root.Config.lon;
	      return rotate_angle;
	    };

	    transition.prototype.load_blur_pano = function(dist, hotspot_angle) {
	      var dfrd, i, path;
	      if (this.destroy) {
	        return $.when().done(function() {}).promise();
	      }
	      path = this.path + "blur_" + (this.current_pano + 1) + "/mobile_";
	      dfrd = [];
	      i = 0;
	      while (i < 6) {
	        dfrd[i] = $.Deferred();
	        i++;
	      }
	      this.blur_pano.pano_id = this.current_pano;
	      i = 0;
	      while (i < 6) {
	        this.blur_pano.mesh.material.materials[i].map.dispose();
	        this.blur_pano.mesh.material.materials[i].map = this.blur_pano.get_texture(this.pano_id, path + root.Config.img_name[i] + ".jpg", dfrd[i], i);
	        this.blur_pano.mesh.material.materials[i].opacity = 0;
	        i++;
	      }
	      this.blur_pano.mesh.position.x = dist * Math.cos(THREE.Math.degToRad(hotspot_angle));
	      this.blur_pano.mesh.position.z = dist * Math.sin(THREE.Math.degToRad(hotspot_angle));
	      return $.when.apply($, dfrd).done(function() {}).promise();
	    };

	    transition.prototype.load_clear_pano = function() {
	      var dfrd, i, path;
	      if (this.destroy) {
	        return $.when().done(function() {}).promise();
	      }
	      path = this.path + (this.current_pano + 1) + "/mobile_";
	      dfrd = [];
	      i = 0;
	      while (i < 6) {
	        dfrd[i] = $.Deferred();
	        i++;
	      }
	      this.clear_pano.pano_id = this.current_pano;
	      i = 0;
	      while (i < 6) {
	        this.clear_pano.mesh.material.materials[i].map.dispose();
	        this.clear_pano.mesh.material.materials[i].map = this.clear_pano.get_texture(this.pano_id, path + root.Config.img_name[i] + ".jpg", dfrd[i], i);
	        this.clear_pano.mesh.material.materials[i].opacity = 0;
	        i++;
	      }
	      return $.when.apply($, dfrd).done(function() {}).promise();
	    };

	    transition.prototype.old_pano_to_blur_pano = function(dist, hotspot_angle, rotate_angle) {
	      var blur_pano, clear_pano, del, i, time, time1;
	      if (this.destroy) {
	        return;
	      }
	      time1 = 0.4;
	      TweenLite.to(root.Config, time1, {
	        lon: rotate_angle,
	        lat: 0,
	        ease: Power0.easeOut
	      });
	      time = 2;
	      del = 0.3;
	      blur_pano = this.blur_pano;
	      clear_pano = this.clear_pano;
	      TweenLite.to(blur_pano.mesh.position, time, {
	        x: 0,
	        z: 0,
	        delay: del,
	        ease: Expo.easeOut
	      });
	      i = 0;
	      while (i < 6) {
	        TweenLite.to(clear_pano.mesh.material.materials[i], time, {
	          opacity: 0,
	          delay: del,
	          ease: Expo.easeOut
	        });
	        TweenLite.to(blur_pano.mesh.material.materials[i], time, {
	          opacity: 1,
	          delay: del,
	          ease: Expo.easeOut
	        });
	        i++;
	      }
	      TweenLite.to(clear_pano.mesh.position, time, {
	        x: -1 * dist * Math.cos(THREE.Math.degToRad(hotspot_angle)),
	        z: -1 * dist * Math.sin(THREE.Math.degToRad(hotspot_angle)),
	        delay: del,
	        ease: Expo.easeOut,
	        onComplete: this.check_new_pano_load.bind(this)
	      });
	    };

	    transition.prototype.check_new_pano_load = function() {
	      var blur_pano_to_new_pano, i;
	      if (this.destroy) {
	        return;
	      }
	      this.clear_pano.mesh.position.x = 0;
	      this.clear_pano.mesh.position.z = 0;
	      i = 0;
	      while (i < 6) {
	        this.clear_pano.mesh.material.materials[i].opacity = 0;
	        this.clear_pano.mesh.material.materials[i].map.dispose();
	        this.blur_pano.mesh.material.materials[i].opacity = 1;
	        i++;
	      }
	      blur_pano_to_new_pano = this.blur_pano_to_new_pano.bind(this);
	      this.load_clear_pano().done(function() {
	        blur_pano_to_new_pano();
	      });
	    };

	    transition.prototype.blur_pano_to_new_pano = function() {
	      var blur_pano, clear_pano, i, time;
	      if (this.destroy) {
	        return;
	      }
	      blur_pano = this.blur_pano;
	      clear_pano = this.clear_pano;
	      time = 0.5;
	      i = 0;
	      while (i < 6) {
	        TweenLite.to(blur_pano.mesh.material.materials[i], time, {
	          opacity: 0,
	          ease: Power0.easeOut
	        });
	        i++;
	      }
	      i = 0;
	      while (i < 6) {
	        if (i === 5) {
	          TweenLite.to(clear_pano.mesh.material.materials[i], time, {
	            opacity: 1,
	            ease: Power0.easeOut,
	            onComplete: this.complete.bind(this)
	          });
	        } else {
	          TweenLite.to(clear_pano.mesh.material.materials[i], time, {
	            opacity: 1,
	            ease: Power0.easeOut
	          });
	        }
	        i++;
	      }
	    };

	    transition.prototype.alter_moving = function() {
	      return this.moving = false;
	    };

	    transition.prototype.complete = function() {
	      var alter_moving, pano_id;
	      if (this.destroy) {
	        return;
	      }
	      pano_id = this.current_pano;
	      alter_moving = this.alter_moving.bind(this);
	      root.Hotspot.add_hotspots(pano_id).done(function() {
	        alter_moving();
	      });
	    };

	    transition.prototype.destroy_transition = function() {
	      var blur_pano, clear_pano;
	      this.destroy = true;
	      blur_pano = this.blur_pano;
	      clear_pano = this.clear_pano;
	      TweenLite.killTweensOf(blur_pano);
	      TweenLite.killTweensOf(clear_pano);
	      this.blur_pano.destroy_pano();
	      this.clear_pano.destroy_pano();
	      this.blur_pano = null;
	      this.clear_pano = null;
	    };

	    return transition;

	  })();

	  root.transition = transition;

	  module.exports = root;

	}).call(this);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.3
	(function() {
	  var hotspot, root;

	  root = __webpack_require__(4);

	  hotspot = (function() {
	    function hotspot(hotspot_angles) {
	      this.panoid = void 0;
	      this.hotspot_angles = hotspot_angles;
	      this.destroy = false;
	    }

	    hotspot.prototype.load_texture = function() {
	      var image, material, texture;
	      texture = new THREE.Texture(window.texture_placeholder);
	      material = new THREE.MeshBasicMaterial({
	        map: texture,
	        overdraw: 0,
	        side: THREE.DoubleSide,
	        blending: THREE.AdditiveBlending,
	        depthTest: false
	      });
	      image = new Image();
	      image.onload = function() {
	        image.onload = null;
	        texture.image = this;
	        return texture.needsUpdate = true;
	      };
	      image.src = '../test/images/logo.png';
	      return material;
	    };

	    hotspot.prototype.add_hotspot = function(angle, dist, hotspotId, dfrd) {
	      var container, geometry, material, panoid, rad_angle, text, text_to_show, v;
	      geometry = new THREE.PlaneBufferGeometry(10, 10, 10);
	      material = this.load_texture();
	      hotspot = new THREE.Mesh(geometry, material);
	      rad_angle = THREE.Math.degToRad(angle);
	      hotspot.position.x = dist * Math.cos(rad_angle);
	      hotspot.position.y = -50;
	      hotspot.position.z = dist * Math.sin(rad_angle);
	      v = new THREE.Vector3(-hotspot.position.x, 400, -hotspot.position.z);
	      hotspot.lookAt(v);
	      geometry = new THREE.PlaneBufferGeometry(1, 1, 1);
	      panoid = this.panoid;
	      text_to_show = DirectPano.hotspot_text[this.hotspot_angles[panoid][hotspotId][0]];
	      hotspot.panoid = this.hotspot_angles[root.Transition.current_pano][hotspotId][0];
	      hotspot.deg_angle = angle;
	      container = document.getElementById('container');
	      text = document.createElement('div');
	      text.setAttribute("id", "hotspot_" + this.hotspot_angles[root.Transition.current_pano][hotspotId][0]);
	      text.innerHTML = text_to_show;
	      container.appendChild(text);
	      hotspot.hotspot_id = hotspotId;
	      hotspot.name = "hotspot";
	      root.scene.add(hotspot);
	      dfrd.resolve();
	    };

	    hotspot.prototype.add_hotspots = function(panoid) {
	      var dfrd, i, num_hotspots;
	      this.panoid = panoid;
	      num_hotspots = this.hotspot_angles[panoid].length;
	      dfrd = [];
	      i = 0;
	      while (i < num_hotspots) {
	        dfrd[i] = $.Deferred();
	        i++;
	      }
	      i = 0;
	      while (i < num_hotspots) {
	        if (this.destroy) {
	          this.remove_hotspots();
	          return;
	        }
	        this.add_hotspot(this.hotspot_angles[panoid][i][1], this.hotspot_angles[panoid][i][2], i, dfrd[i]);
	        i++;
	      }
	      return $.when.apply($, dfrd).done(function() {}).promise();
	    };

	    hotspot.prototype.remove_hotspots = function() {
	      var i, len, object, p;
	      len = root.scene.children.length;
	      p = 0;
	      i = 0;
	      while (i < len) {
	        object = root.scene.children[p];
	        if (object.name === "hotspot") {
	          object.geometry.dispose();
	          object.material.dispose();
	          root.scene.remove(object);
	          $("#hotspot_" + object.panoid).remove();
	        } else {
	          p += 1;
	        }
	        i++;
	      }
	    };

	    hotspot.prototype.front_nearest_hotspot = function(panoid) {
	      var flag, i, lon, near_angle, near_id, num_hotspots, temp;
	      num_hotspots = this.hotspot_angles[panoid].length;
	      near_id = -1;
	      near_angle = void 0;
	      flag = false;
	      i = 0;
	      while (i < num_hotspots) {
	        temp = this.hotspot_angles[panoid][i][1];
	        lon = (root.Config.lon + 360) % 360;
	        if (temp < 0) {
	          temp += 360;
	        }
	        if (((lon >= 45) && (lon <= 315) && (temp <= (lon + 45) % 360) && (temp >= (lon - 45 + 360) % 360)) || ((lon <= 45) && (temp >= 0) && (temp <= lon + 45)) || ((lon <= 45) && (temp >= (lon - 45 + 360) % 360) && (temp <= 360)) || ((lon >= 315) && (temp >= (lon - 45)) && (temp <= 360)) || ((lon >= 315) && (temp >= 0) && (temp <= (lon + 45) % 360))) {
	          if (flag === false || ((Math.abs(temp - lon)) < (Math.abs(near_angle - lon)))) {
	            near_angle = temp;
	            near_id = i;
	            flag = true;
	          }
	        }
	        i++;
	      }
	      return near_id;
	    };

	    hotspot.prototype.back_nearest_hotspot = function(panoid) {
	      var flag, i, lon, near_angle, near_id, num_hotspots, temp;
	      num_hotspots = this.hotspot_angles[panoid].length;
	      near_id = -1;
	      near_angle = void 0;
	      flag = false;
	      i = 0;
	      while (i < num_hotspots) {
	        temp = this.hotspot_angles[panoid][i][1];
	        lon = (root.Config.lon + 360 + 180) % 360;
	        if (temp < 0) {
	          temp += 360;
	        }
	        if (((lon >= 45) && (lon <= 315) && (temp <= (lon + 45) % 360) && (temp >= (lon - 45 + 360) % 360)) || ((lon <= 45) && (temp >= 0) && (temp <= lon + 45)) || ((lon <= 45) && (temp >= (lon - 45 + 360) % 360) && (temp <= 360)) || ((lon >= 315) && (temp >= (lon - 45)) && (temp <= 360)) || ((lon >= 315) && (temp >= 0) && (temp <= (lon + 45) % 360))) {
	          if (flag === false || ((Math.abs(temp - lon)) < (Math.abs(near_angle - lon)))) {
	            near_angle = temp;
	            near_id = i;
	            flag = true;
	          }
	        }
	        i++;
	      }
	      return near_id;
	    };

	    hotspot.prototype.destroy_hotspot = function() {
	      this.destroy = true;
	      return this.remove_hotspots();
	    };

	    return hotspot;

	  })();

	  root.hotspot = hotspot;

	  module.exports = root;

	}).call(this);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.3
	(function() {
	  var Pano, root;

	  root = __webpack_require__(5);

	  Pano = (function() {
	    function Pano(pano_id1, is_blur) {
	      this.pano_id = pano_id1;
	      this.is_blur = is_blur;
	      this.name = "panorama";
	      this.destroy = false;
	    }

	    Pano.prototype.create_pano = function(path, opacity) {
	      var geometry, i, materials;
	      materials = [];
	      i = 0;
	      while (i < 6) {
	        materials.push(this.load_texture(path + root.Config.img_name[i] + ".jpg", i));
	        i++;
	      }
	      geometry = root.Config.webgl ? new THREE.BoxGeometry(300, 300, 300, 7, 7, 7) : new THREE.BoxGeometry(300, 300, 300, 20, 20, 20);
	      this.mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
	      this.mesh.scale.x = -1;
	      i = 0;
	      while (i < 6) {
	        this.mesh.material.materials[i].transparent = true;
	        this.mesh.material.materials[i].opacity = opacity;
	        i++;
	      }
	      root.scene.add(this.mesh);
	    };

	    Pano.prototype.destroy_pano = function() {
	      var i;
	      this.destroy = true;
	      root.scene.remove(this.mesh);
	      i = 0;
	      while (i < 6) {
	        this.mesh.material.materials[i].map.dispose();
	        this.mesh.material.materials[i].dispose();
	        i++;
	      }
	      return this.mesh.geometry.dispose();
	    };

	    Pano.prototype.load_texture = function(path, image_index) {
	      var image, material, pano_id, texture;
	      texture = new THREE.Texture(root.texture_placeholder);
	      material = new THREE.MeshBasicMaterial({
	        map: texture,
	        overdraw: 0,
	        side: THREE.DoubleSide,
	        blending: THREE.AdditiveBlending,
	        depthTest: false
	      });
	      pano_id = this.pano_id;
	      image = new Image();
	      image.onload = function() {
	        image.onload = null;
	        texture.image = this;
	        texture.needsUpdate = true;
	        root.clear_images[pano_id][image_index] = image;
	      };
	      image.src = path;
	      return material;
	    };

	    Pano.prototype.get_texture = function(panoid, path, dfrd, image_index) {
	      var flag, image, texture;
	      flag = false;
	      texture = new THREE.Texture(root.texture_placeholder);
	      panoid = this.pano_id;
	      if (root.clear_images[panoid][image_index]) {
	        flag = true;
	        texture.image = root.clear_images[panoid][image_index];
	        texture.needsUpdate = true;
	        dfrd.resolve();
	        return texture;
	      }
	      if (this.is_blur === true && root.blur_images[panoid][image_index]) {
	        flag = true;
	        texture.image = root.blur_images[panoid][image_index];
	        texture.needsUpdate = true;
	        dfrd.resolve();
	        return texture;
	      }
	      image = new Image();
	      image.onload = function() {
	        texture.image = this;
	        texture.needsUpdate = true;
	        dfrd.resolve();
	      };
	      image.src = path;
	      return texture;
	    };

	    return Pano;

	  })();

	  root.Pano = Pano;

	  module.exports = root;

	}).call(this);


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.9.3
	(function() {
	  var animation, root;

	  root = __webpack_require__(6);

	  animation = (function() {
	    function animation() {
	      this.destroy = false;
	      this.animate();
	    }

	    animation.prototype.animate = function() {
	      if (!this.destroy) {
	        requestAnimationFrame(this.animate.bind(this));
	        this.update();
	      }
	    };

	    animation.prototype.update = function() {
	      var container, duration, i, len, object, p, phi, pos, rad_angle, rotate_camera, text, theta, vector;
	      if (root.Config.isUserInteracting === false && root.Config.autoplay === true) {
	        root.Config.lon += 0.2;
	      } else if (root.Config.isUserInteracting === false) {
	        duration = Date.now() - root.Config.stop_time;
	        if (duration > 2000) {
	          root.Config.autoplay = true;
	          rotate_camera = function(time, lat) {
	            if (root.Config.isUserInteracting === true) {
	              return;
	            }
	            duration = Date.now() - time;
	            if (duration < 1000) {
	              root.Config.lat = lat - (lat * duration / 1000);
	              return requestAnimationFrame(function() {
	                rotate_camera(time, lat);
	              });
	            } else {
	              root.Config.lat = 0;
	            }
	          };
	          rotate_camera(Date.now(), root.Config.lat);
	        }
	      }
	      len = root.scene.children.length;
	      p = 0;
	      i = 0;
	      while (i < len) {
	        object = root.scene.children[i];
	        if (object.name === "hotspot") {
	          text = document.getElementById("hotspot_" + object.panoid);
	          vector = object.position.clone();
	          rad_angle = THREE.Math.degToRad(object.deg_angle + 5);
	          vector.x += 13 * Math.cos(rad_angle);
	          vector.z += 13 * Math.sin(rad_angle);
	          vector = vector.project(root.camera);
	          container = document.getElementById('container');
	          pos = {
	            x: (vector.x + 1) / 2 * container.offsetWidth,
	            y: -(vector.y - 1) / 2 * container.offsetHeight
	          };
	          if (text) {
	            if (vector.x > 1 || vector.x < -1 || vector.y > 1 || vector.y < -1 || vector.z > 1 || vector.z < -1) {
	              if ($("#hotspot_" + object.panoid).css('display') !== 'none') {
	                $("#hotspot_" + object.panoid).removeAttr('style');
	                $("#hotspot_" + object.panoid).css({
	                  'display': 'none'
	                });
	              }
	            } else {
	              $("#hotspot_" + object.panoid).css({
	                'display': 'block',
	                'left': '-10px',
	                'top': '0px',
	                'transform': 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0px)',
	                'text-align': 'left',
	                'color': 'Yellow',
	                'position': 'absolute',
	                'margin-left': '-20px'
	              });
	            }
	          }
	        }
	        i++;
	      }
	      root.Config.lon = (root.Config.lon + 360) % 360;
	      root.Config.lat = Math.max(-35, Math.min(35, root.Config.lat));
	      phi = THREE.Math.degToRad(90 - root.Config.lat);
	      theta = THREE.Math.degToRad(root.Config.lon);
	      root.camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
	      root.camera.target.y = 500 * Math.cos(phi);
	      root.camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
	      root.camera.lookAt(root.camera.target);
	      root.renderer.render(root.scene, root.camera);
	    };

	    return animation;

	  })();

	  root.animation = animation;

	  module.exports = root;

	}).call(this);


/***/ },
/* 6 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.9.3
	(function() {
	  var Config, active, blur_images, camera, clear_images, destroy, detect_webgl, escape_fullscreen, go_fullscreen, init, raycaster, renderer, root, scene, texture_placeholder;

	  root = {};

	  camera = void 0;

	  scene = void 0;

	  renderer = void 0;

	  texture_placeholder = void 0;

	  raycaster = new THREE.Raycaster;

	  blur_images = {};

	  clear_images = {};

	  active = void 0;

	  Config = {
	    img_name: ['r', 'l', 'u', 'd', 'f', 'b'],
	    isUserInteracting: false,
	    lon: 0,
	    lat: 0,
	    stop_time: void 0,
	    autoplay: true,
	    webgl: true
	  };

	  go_fullscreen = function() {
	    var container, image;
	    container = document.getElementById(DirectPano.pano_div_id);
	    container.style.width = window.innerWidth + 'px';
	    container.style.height = window.innerHeight + 'px';
	    renderer.setSize(window.innerWidth, window.innerHeight);
	    image = document.getElementById(DirectPano.image_div_id);
	    image.style.visibility = 'hidden';
	    camera.aspect = window.innerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();
	  };

	  escape_fullscreen = function() {
	    var container, image;
	    container = document.getElementById(DirectPano.pano_div_id);
	    container.style.width = DirectPano.initial_width + 'px';
	    container.style.height = DirectPano.initial_height + 'px';
	    renderer.setSize(container.offsetWidth, container.offsetHeight);
	    image = document.getElementById(DirectPano.image_div_id);
	    image.style.visibility = 'visible';
	    camera.aspect = container.offsetWidth / container.offsetHeight;
	    camera.updateProjectionMatrix();
	  };

	  detect_webgl = function() {
	    var canvas, e;
	    try {
	      canvas = document.createElement('canvas');
	      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
	    } catch (_error) {
	      e = _error;
	      Config.webgl = false;
	      return false;
	    }
	  };

	  init = function() {
	    var container;
	    container = document.getElementById(DirectPano.pano_div_id);
	    scene = new THREE.Scene;
	    texture_placeholder = document.createElement('canvas');
	    texture_placeholder.width = 128;
	    texture_placeholder.height = 128;
	    renderer = detect_webgl() ? new THREE.WebGLRenderer : new THREE.CanvasRenderer;
	    renderer.setPixelRatio(window.devicePixelRatio);
	    container.appendChild(renderer.domElement);
	    renderer.setSize(container.offsetWidth, container.offsetHeight);
	    camera = new THREE.PerspectiveCamera(65, container.offsetWidth / container.offsetHeight, 1, 1100);
	    camera.target = new THREE.Vector3(0, 0, 0);
	    $('#' + DirectPano.image_div_id).click(function() {
	      go_fullscreen();
	    });
	  };

	  destroy = function(dfrd) {
	    var i, j, len, len1, prop;
	    root.Hotspot = void 0;
	    for (i = 0, len = clear_images.length; i < len; i++) {
	      prop = clear_images[i];
	      clear_images[prop] = null;
	    }
	    for (j = 0, len1 = blur_images.length; j < len1; j++) {
	      prop = blur_images[j];
	      blur_images[prop] = null;
	    }
	    clear_images = {};
	    blur_images = {};
	    Config.lon = 0;
	    Config.lat = 0;
	    Config.stop_time = void 0;
	    Config.autoplay = true;
	  };

	  init();

	  root.destroy = destroy;

	  root.Config = Config;

	  root.camera = camera;

	  root.scene = scene;

	  root.renderer = renderer;

	  root.blur_images = blur_images;

	  root.clear_images = clear_images;

	  root.texture_placeholder = texture_placeholder;

	  root.raycaster = raycaster;

	  root.escape_fullscreen = escape_fullscreen;

	  module.exports = root;

	}).call(this);


/***/ }
/******/ ]);