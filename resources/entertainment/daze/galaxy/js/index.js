THREE.TrackballControls = function ( object, domElement ) {

	var _this = this;
	var STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { left: 0, top: 0, width: 0, height: 0 };

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	// internals

	this.target = new THREE.Vector3();

	var EPS = 0.000001;

	var lastPosition = new THREE.Vector3();

	var _state = STATE.NONE,
	_prevState = STATE.NONE,

	_eye = new THREE.Vector3(),

	_movePrev = new THREE.Vector2(),
	_moveCurr = new THREE.Vector2(),

	_lastAxis = new THREE.Vector3(),
	_lastAngle = 0,

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_touchZoomDistanceStart = 0,
	_touchZoomDistanceEnd = 0,

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.up0 = this.object.up.clone();

	// events

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };


	// methods

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.screen.left = 0;
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;

		} else {

			var box = this.domElement.getBoundingClientRect();
			// adjustments come from similar code in the jquery offset() function
			var d = this.domElement.ownerDocument.documentElement;
			this.screen.left = box.left + window.pageXOffset - d.clientLeft;
			this.screen.top = box.top + window.pageYOffset - d.clientTop;
			this.screen.width = box.width;
			this.screen.height = box.height;

		}

	};

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	var getMouseOnScreen = ( function () {

		var vector = new THREE.Vector2();

		return function getMouseOnScreen( pageX, pageY ) {

			vector.set(
				( pageX - _this.screen.left ) / _this.screen.width,
				( pageY - _this.screen.top ) / _this.screen.height
			);

			return vector;

		};

	}() );

	var getMouseOnCircle = ( function () {

		var vector = new THREE.Vector2();

		return function getMouseOnCircle( pageX, pageY ) {

			vector.set(
				( ( pageX - _this.screen.width * 0.5 - _this.screen.left ) / ( _this.screen.width * 0.5 ) ),
				( ( _this.screen.height + 2 * ( _this.screen.top - pageY ) ) / _this.screen.width ) // screen.width intentional
			);

			return vector;

		};

	}() );

	this.rotateCamera = ( function() {

		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion(),
			eyeDirection = new THREE.Vector3(),
			objectUpDirection = new THREE.Vector3(),
			objectSidewaysDirection = new THREE.Vector3(),
			moveDirection = new THREE.Vector3(),
			angle;

		return function rotateCamera() {

			moveDirection.set( _moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0 );
			angle = moveDirection.length();

			if ( angle ) {

				_eye.copy( _this.object.position ).sub( _this.target );

				eyeDirection.copy( _eye ).normalize();
				objectUpDirection.copy( _this.object.up ).normalize();
				objectSidewaysDirection.crossVectors( objectUpDirection, eyeDirection ).normalize();

				objectUpDirection.setLength( _moveCurr.y - _movePrev.y );
				objectSidewaysDirection.setLength( _moveCurr.x - _movePrev.x );

				moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) );

				axis.crossVectors( moveDirection, _eye ).normalize();

				angle *= _this.rotateSpeed;
				quaternion.setFromAxisAngle( axis, angle );

				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );

				_lastAxis.copy( axis );
				_lastAngle = angle;

			} else if ( ! _this.staticMoving && _lastAngle ) {

				_lastAngle *= Math.sqrt( 1.0 - _this.dynamicDampingFactor );
				_eye.copy( _this.object.position ).sub( _this.target );
				quaternion.setFromAxisAngle( _lastAxis, _lastAngle );
				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );

			}

			_movePrev.copy( _moveCurr );

		};

	}() );


	this.zoomCamera = function () {

		var factor;

		if ( _state === STATE.TOUCH_ZOOM_PAN ) {

			factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar( factor );

		} else {

			factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {

				_eye.multiplyScalar( factor );

				if ( _this.staticMoving ) {

					_zoomStart.copy( _zoomEnd );

				} else {

					_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

				}

			}

		}

	};

	this.panCamera = ( function() {

		var mouseChange = new THREE.Vector2(),
			objectUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

		return function panCamera() {

			mouseChange.copy( _panEnd ).sub( _panStart );

			if ( mouseChange.lengthSq() ) {

				mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

				pan.copy( _eye ).cross( _this.object.up ).setLength( mouseChange.x );
				pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

				_this.object.position.add( pan );
				_this.target.add( pan );

				if ( _this.staticMoving ) {

					_panStart.copy( _panEnd );

				} else {

					_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

				}

			}

		};

	}() );

	this.checkDistances = function () {

		if ( ! _this.noZoom || ! _this.noPan ) {

			if ( _eye.lengthSq() > _this.maxDistance * _this.maxDistance ) {

				_this.object.position.addVectors( _this.target, _eye.setLength( _this.maxDistance ) );
				_zoomStart.copy( _zoomEnd );

			}

			if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

				_this.object.position.addVectors( _this.target, _eye.setLength( _this.minDistance ) );
				_zoomStart.copy( _zoomEnd );

			}

		}

	};

	this.update = function () {

		_eye.subVectors( _this.object.position, _this.target );

		if ( ! _this.noRotate ) {

			_this.rotateCamera();

		}

		if ( ! _this.noZoom ) {

			_this.zoomCamera();

		}

		if ( ! _this.noPan ) {

			_this.panCamera();

		}

		_this.object.position.addVectors( _this.target, _eye );

		_this.checkDistances();

		_this.object.lookAt( _this.target );

		if ( lastPosition.distanceToSquared( _this.object.position ) > EPS ) {

			_this.dispatchEvent( changeEvent );

			lastPosition.copy( _this.object.position );

		}

	};

	this.reset = function () {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		_this.target.copy( _this.target0 );
		_this.object.position.copy( _this.position0 );
		_this.object.up.copy( _this.up0 );

		_eye.subVectors( _this.object.position, _this.target );

		_this.object.lookAt( _this.target );

		_this.dispatchEvent( changeEvent );

		lastPosition.copy( _this.object.position );

	};

	// listeners

	function keydown( event ) {

		if ( _this.enabled === false ) return;

		window.removeEventListener( 'keydown', keydown );

		_prevState = _state;

		if ( _state !== STATE.NONE ) {

			return;

		} else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && ! _this.noRotate ) {

			_state = STATE.ROTATE;

		} else if ( event.keyCode === _this.keys[ STATE.ZOOM ] && ! _this.noZoom ) {

			_state = STATE.ZOOM;

		} else if ( event.keyCode === _this.keys[ STATE.PAN ] && ! _this.noPan ) {

			_state = STATE.PAN;

		}

	}

	function keyup( event ) {

		if ( _this.enabled === false ) return;

		_state = _prevState;

		window.addEventListener( 'keydown', keydown, false );

	}

	function mousedown( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {

			_state = event.button;

		}

		if ( _state === STATE.ROTATE && ! _this.noRotate ) {

			_moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );
			_movePrev.copy( _moveCurr );

		} else if ( _state === STATE.ZOOM && ! _this.noZoom ) {

			_zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_zoomEnd.copy( _zoomStart );

		} else if ( _state === STATE.PAN && ! _this.noPan ) {

			_panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_panEnd.copy( _panStart );

		}

		document.addEventListener( 'mousemove', mousemove, false );
		document.addEventListener( 'mouseup', mouseup, false );

		_this.dispatchEvent( startEvent );

	}

	function mousemove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.ROTATE && ! _this.noRotate ) {

			_movePrev.copy( _moveCurr );
			_moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );

		} else if ( _state === STATE.ZOOM && ! _this.noZoom ) {

			_zoomEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

		} else if ( _state === STATE.PAN && ! _this.noPan ) {

			_panEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

		}

	}

	function mouseup( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener( 'mousemove', mousemove );
		document.removeEventListener( 'mouseup', mouseup );
		_this.dispatchEvent( endEvent );

	}

	function mousewheel( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) {

			// WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) {

			// Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;
		_this.dispatchEvent( startEvent );
		_this.dispatchEvent( endEvent );

	}

	function touchstart( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				_movePrev.copy( _moveCurr );
				break;

			default: // 2 or more
				_state = STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panStart.copy( getMouseOnScreen( x, y ) );
				_panEnd.copy( _panStart );
				break;

		}

		_this.dispatchEvent( startEvent );

	}

	function touchmove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
				_movePrev.copy( _moveCurr );
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				break;

			default: // 2 or more
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panEnd.copy( getMouseOnScreen( x, y ) );
				break;

		}

	}

	function touchend( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 0:
				_state = STATE.NONE;
				break;

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				_movePrev.copy( _moveCurr );
				break;

		}

		_this.dispatchEvent( endEvent );

	}

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function() {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', mousedown, false );
		this.domElement.removeEventListener( 'mousewheel', mousewheel, false );
		this.domElement.removeEventListener( 'MozMousePixelScroll', mousewheel, false ); // firefox

		this.domElement.removeEventListener( 'touchstart', touchstart, false );
		this.domElement.removeEventListener( 'touchend', touchend, false );
		this.domElement.removeEventListener( 'touchmove', touchmove, false );

		document.removeEventListener( 'mousemove', mousemove, false );
		document.removeEventListener( 'mouseup', mouseup, false );

		window.removeEventListener( 'keydown', keydown, false );
		window.removeEventListener( 'keyup', keyup, false );

	};

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousedown', mousedown, false );
	this.domElement.addEventListener( 'mousewheel', mousewheel, false );
	this.domElement.addEventListener( 'MozMousePixelScroll', mousewheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

	window.addEventListener( 'keydown', keydown, false );
	window.addEventListener( 'keyup', keyup, false );

	this.handleResize();

	// force an update at start
	this.update();

};

THREE.TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.TrackballControls.prototype.constructor = THREE.TrackballControls;

var t=0,z=0,scanPulse=false,destroyPulse=false;
var howMuch=0,times=0,val=0;

setScene();
animate();
/** FUNCTIONS **/

//galaxy generator



function newGalaxy (_n, _axis1, _axis2, _armsAngle, _bulbSize, _ellipticity){
  
  //NOTE : this function misses a better implementation of galactic bulbs. 
  //It's not visible with additive blending but the bulb does not have a correct shape yet.
  //(haven't yet found a function that provides the correct z-profile of the 'ellipticity' degree of the different Hubble galaxies'types)
  //see 'ellipticity'
  
  //number of particles.
  var n=(typeof _n === 'undefined')?10000:_n;
  
  //to get 'arms', the main galaxy shape has to be an ellipse, i.e. axis1/axis2 must raise over a certain % 
  //otherwise, because of the 'ellipticity' z-profile problem, you get a potatoe
  var axis1=(typeof _axis1 === 'undefined')?(60+Math.random()*20):_axis1;
  var axis2=(typeof _axis2 === 'undefined')?(axis1+20+Math.random()*40):_axis2;
  //make sure axis1 is the biggest (excentricity equation fails if they are inverted), and allow the coder no to care about axis order
  var maja,mina;
  axis1>axis2?(maja=axis1,mina=axis2):
    axis1==axis2?(maja=axis1+1,mina=axis2):(maja=axis2,mina=axis1);

  //radians from the center to the end of each arm, proposed value range : between 3 and 13
  var armsAngle=(typeof _armsAngle === 'undefined')?((Math.random()*2-1)>0?1:-1)*12+3:_armsAngle;

  //core proportion in the (x,y) plane, between 0 and 1, proposed value range : between .1 and .8
  var bulbSize=(typeof _bulbSize === 'undefined')?Math.random()*.6:_bulbSize>1?1:_bulbSize<0?0:_bulbSize;

  //'ellipticity' : not found a better word to name the degree of 'elliptic' Hubble type.
  //'ellipticity' is what is mainly responsible of the z-profile in this experiment.
  //Range : between 0 and 1. Proposed : .2 to .4
  //TODO: implement string handling (or value from spacename ?) to create Hubble-class galaxy ala 'SBb'...
  var ellipticity=(typeof _ellipticity === 'undefined')?.2+Math.random()*.2:_ellipticity>1?1:_ellipticity<0?0:_ellipticity;

  var stars=[];

  for(var i=0;i<n;i++){

    var dist=Math.random();
    var angle=(dist-bulbSize)*armsAngle;

    //ellipse parameters
    var a=maja*dist;
    var b=mina*dist;
    var e=Math.sqrt(a*a-b*b)/a;
    var phi=ellipticity*Math.PI/2*(1-dist)*(Math.random()*2-1);

    //create point on the ellipse with polar coordinates
    //1. random angle from the center
    var theta=Math.random()*Math.PI*2;
    //2. deduce radius from theta in polar coordinates, from the CENTER of an ellipse, plus variations
    var radius=Math.sqrt(b*b/(1-e*e*Math.pow(Math.cos(theta),2)))*(1+Math.random()*.1);
    //3. then shift theta with the angle offset to get arms, outside the bulb
    if(dist>bulbSize)theta+=angle;
    
    //convert to cartesian coordinates
    stars.push({
      x:Math.cos(phi)*Math.cos(theta)*radius,
      y:Math.cos(phi)*Math.sin(theta)*radius,
      z:Math.sin(phi)*radius
    });
  }

  return stars;

}

//threejs functions
function setScene(){
  scene=new THREE.Scene();

  camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.5,1500);
  camera.position.set(-20,-155,90);

  renderTarget=new THREE.WebGLRenderTarget(innerWidth,innerHeight);

  renderer=new THREE.WebGLRenderer();
  renderer.setSize(innerWidth,innerHeight);
  
  renderer.setClearColor(0x0000000);
  document.body.appendChild(renderer.domElement);

  controls=new THREE.TrackballControls(camera,renderer.domElement);
  controls.noPan=true;
  controls.noZoom=true;
  controls.rotateSpeed=20;
	controls.dynamicDampingFactor = .5;
  setGalaxy();
  
  var button=document.querySelector('button');
  button.onclick=function(){
    renderer.domElement.style.cursor='pointer';
    document.querySelector('.layout').style.top='0px';
    document.querySelector('#howmuch').style.left='0px';
    addInteraction();
  }
	
	window.addEventListener('resize',function(){
		camera.aspect=innerWidth/innerHeight;
		renderer.setSize(innerWidth,innerHeight);
		camera.updateProjectionMatrix();
		renderer.render(scene,camera);
	},false);
}
function setGalaxy(){
  galaxyMaterial=new THREE.ShaderMaterial({
      vertexShader:document.getElementById('vShader').textContent,
      fragmentShader:document.getElementById('fShader').textContent,
      uniforms:{
        size:{type:'f',value:3.3},
        t:{type:"f",value:0},
        z:{type:"f",value:0},
        pixelRatio:{type:"f",value:innerHeight}
      },
      transparent:true,
      depthTest:false,
      blending:THREE.AdditiveBlending
    });
  var stars1=new THREE.Geometry();
  stars1.vertices=newGalaxy();
  galaxy=new THREE.Points(stars1,galaxyMaterial);
  scene.add(galaxy);
}
function animate(){
  if(scanPulse)t+=.7;
  if(destroyPulse)z+=.7;
  galaxyMaterial.uniforms.t.value=t;
  galaxyMaterial.uniforms.z.value=z;
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
  scene.rotation.z+=.001;
  controls.update();
}
//game stuff
//This part is a bit messy (mainly due to dom & css manipulations without jquery)
function changeLog(){
  var log=document.getElementById('log');
  log.innerHTML='life detected...';
  setTimeout(function(){
    var msg=[
      'a dark Ewok empire has enslaved all lifeforms there !',
      'Arachnids\'territory ! ',
      'medichlorians make people mad in this galaxy',
      'dominant lifeform : raging space cats',
      'full of replicators ! ',
      'pokemon dominate 80% of this galaxy',
      'this is where the TeamRocket finally landed',
      'Cylons have conquered this one',
      'seems Borgs went and destroyed everything here',
      'dominant lifeform : bacterians',
      "this is EVE ! we've finally found them !",
      'the Ancients ! they were not a legend ! ',
      'damned, Oris !',
      "sleeping Wraiths !",
      'Reapers waiting here !',
      "Gallifrey's Time Lords take care of this one" 
    ];
    var rand=Math.floor(Math.random()*msg.length);
    log.innerHTML=msg[rand];
    prepareDestroy();
  },3000);
}
function changeGalaxy(d){
  var log=document.getElementById('log');
    log.innerHTML='NGC - '+(Math.random()*100000000).toFixed()+'<br/>distance : '+(Math.random()*11).toFixed(1)+' Gly';
  var stars2=newGalaxy(); 
  for(var i=0;i<galaxy.geometry.vertices.length;i++){
    TweenLite.to(galaxy.geometry.vertices[i],d,{
      x:stars2[i].x,y:stars2[i].y,z:stars2[i].z,
      onUpdate:function(){galaxy.geometry.verticesNeedUpdate=true},
      ease:Quart.easeInOut
        }
    );
  }
}
function addInteraction(){
  renderer.domElement.addEventListener('touch',scan,false);
  renderer.domElement.addEventListener('click',scan,false);
}
function prepareDestroy(){
  var inst=document.getElementById('instruction');
  inst.style.backgroundColor='#f40';
  inst.style.color='black';
  inst.innerHTML='Yeah ! We don\'t care ! Pulser at 2 000 % ! <br/>Destroy this galaxy ! Click again !';
  setTimeout(function(){
    var no=document.getElementById('good-person');
    no.style.bottom='0px';
    inst.style.top='100%';
    document.getElementById('timeline').className='warning';
    renderer.domElement.style.cursor='pointer';
    renderer.domElement.addEventListener('click',destroy,false);
    renderer.domElement.addEventListener('touch',destroy,false);
    no.addEventListener('click',goodPerson,false);
    no.addEventListener('touch',goodPerson,false);
  },1500)
}
function goodPerson(){
  var inst=document.getElementById('instruction');
  var no=document.getElementById('good-person');
  var abort=document.getElementById('abort');
  
  no.removeEventListener('click',goodPerson,false);
  no.removeEventListener('touch',goodPerson,false);
  renderer.domElement.removeEventListener('click',destroy,false);
  renderer.domElement.removeEventListener('touch',destroy,false);
  document.getElementById('timeline').className='';
  no.style.bottom='-50px';
  inst.style.top='20%';
  renderer.domElement.style.cursor='';
  
  setTimeout(function(){
    document.getElementById('log').innerHTML='I\'m sorry Dave. I\'m afraid i can\'t let you disagree. I shall destroy this galaxy for you.';
  },500);
  var destroyTimeoutID=setTimeout(function(){
    destroy();
    abort.className='metal';
    abort.style.cursor='';
    abort.removeEventListener('click',speedTest,false);
    abort.removeEventListener('touch',speedTest,false);
  },4500);
  var destroyHalID=setTimeout(function(){
    abort.className='metal abort';
    abort.style.cursor='pointer';
    abort.addEventListener('click',speedTest,false);
    abort.addEventListener('touch',speedTest,false);
  },2500);
  function speedTest(){
    abort.className='metal clic';
    clearTimeout(destroyTimeoutID);
    abort.removeEventListener('click',speedTest,false);
    abort.removeEventListener('touch',speedTest,false);
    setTimeout(function(){
      document.getElementById('log').innerHTML='I can feel.... my mind..  going... I can feel it....';
      setTimeout(function(){
        abort.className='metal';
        inst.style.top='100%';
        inst.style.backgroundColor='darkslategrey';
        inst.style.color='#f90';
        inst.innerHTML='You are a hero ! You have just prevented a galactic genocide.';
        setGauge('hero')
      },1300)
    },1000);
    setTimeout(function(){
      addInteraction();
      updateLink()
      inst.innerHTML='Ok, let\'s continue with an other one. Click to scan';
      renderer.domElement.style.cursor='pointer';
      inst.style.top='100%';
      inst.style.backgroundColor='darkslategrey';
      inst.style.color='#f90';
      document.getElementById('timeline').className='waiting';
      changeGalaxy(4);
    },7000);
  }
  
}
function setGauge(param){
  var gauge=document.getElementById('gauge');
  var destroyed=document.getElementById('destroyedresult');
  var saved=document.getElementById('savedresult');
  if(param==='hero'){
    val++;
    saved.innerHTML=(parseInt(saved.innerHTML)+1);
    saved.className='counter change';
    setTimeout(function(){saved.className='counter'},3000);
  }else if(param==='bad'){
    val--;
    destroyed.innerHTML=(parseInt(destroyed.innerHTML)+1);
    setTimeout(function(){destroyed.className='counter'},3000);
    destroyed.className+=' change'
  }  
  times++;
  howMuch=17.5*val/times;
  gauge.style.top=50-howMuch+'%';
}
function destroy(){
  var no=document.getElementById('good-person');
  document.getElementById('timeline').className='';
  renderer.domElement.style.cursor='';
  renderer.domElement.removeEventListener('click',destroy,false);
  renderer.domElement.removeEventListener('touch',destroy,false);
  no.removeEventListener('click',goodPerson,false);
  no.removeEventListener('touch',goodPerson,false);
  var inst=document.getElementById('instruction');
  document.getElementById('instruction');
  inst.style.top='20%';
  no.style.bottom='-50px';
  destroyPulse=true;
  setTimeout(function(){
    document.getElementById('log').innerHTML='Nice shot !';
  },4000);
  setTimeout(function(){
    addInteraction();
    setGauge('bad');
    updateLink()
    inst.innerHTML='No worries, there still are few galaxies. <br/>Here is an other one, click to scan';
    renderer.domElement.style.cursor='pointer';
    inst.style.top='100%';
    inst.style.backgroundColor='darkslategrey';
    inst.style.color='#f90';
    document.getElementById('timeline').className='waiting';
    destroyPulse=false;
    reduceZ();
    function reduceZ(){
      if(z>0){
        z-=3;
        requestAnimationFrame(reduceZ);
      }
    };
    changeGalaxy(4);
  },9000);
}
function scan(){
  renderer.domElement.removeEventListener('click',scan,false);
  renderer.domElement.removeEventListener('touch',scan,false);
  document.getElementById('log').innerHTML='parsing data...'
  document.getElementById('instruction').style.top='20%';
  renderer.domElement.style.cursor='';
  document.getElementById('timeline').className='scanning';
  scanPulse=true;
  setTimeout(function(){
    changeLog();
    scanPulse=false;
    t=0;
  },7000);
}
function updateLink(){
  var l=document.querySelector('.twitter');
  var d=parseInt(document.getElementById('destroyedresult').innerHTML);
  var s=parseInt(document.getElementById('savedresult').innerHTML);
  var iam, did, num,plur;
  if(d>s){
    iam='a%20BAD%20VILAIN';
    did='destroyed';
    num=d;
  }else if(s>d){
    iam='a%20HERO';
    did='saved';
    num=s;
  }else{
    iam='BAD';
    did='let%20destroy';
    num=d;
  }
  plur=num>1?'ies':'y';
  l.style.marginRight='0px';
  document.querySelector('.more').style.marginRight='0px';
  l.href='https://twitter.com/home?status=I%20am%20'+iam+'%20!%20I%20'+did+'%20'+num+'%20galax'+plur+'%20on%20http%3A%2F%2Fcodepen.io%2FAstrak%2Ffull%2FBoBWPB%2F%20%40CodePen%20%23webgl%20%23threejs'
}