


// String to create WebGL vertex shader
var vertex_shader = 
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +	
	'attribute vec4 a_Position;\n' +
	'attribute vec3 a_fragmentNormal;\n' +
	'attribute vec3 a_vertexNormal;\n' +
	'attribute vec2 a_textureCoord;\n' + 
	
	'uniform mat4 u_transformMatrix;\n' +
	'uniform mat4 u_invTransformMatrix;\n' +
	
	'uniform bool u_drawSolidColor;\n' +
	'uniform bool u_GourandShadingOn;\n' +
	'uniform bool u_specularOn;\n' +
	'uniform float u_glossyness;\n' +
	'uniform bool u_isObject;\n' +
	
	'uniform bool u_light1On;\n' +
	'uniform bool u_light2On;\n' +
	
	'uniform vec3 u_colorLight1;\n' +
	'uniform vec3 u_colorLight2;\n' +
	
	'uniform vec3 u_kDiffuse;\n' +
	'uniform vec3 u_kSpecular;\n' +
	'uniform vec3 u_kAmbient;\n' +
	
	'uniform vec3 u_light1Dir;\n' +
	'uniform vec3 u_light2Position;\n' +
	'uniform vec3 u_light2Dir;\n' +
	'uniform vec3 u_viewingDir;\n' +
	
	'uniform vec4 u_SolidColor;\n' +
	'uniform mat4 u_ProjMatrix;\n' +
	'uniform mat4 u_ViewMatrix;\n' +
	'uniform float u_colorOpacity;\n' + 
	'varying float v_colorOpacity;\n' + 
	'varying vec4 v_Color;\n' +
	'varying vec2 v_textureCoord;\n' +
	
	'varying float v_cosThetaL1;\n' +
	'varying float v_cosThetaL2;\n' +
	'varying vec3 v_diffuseColorLight1;\n' +
	'varying vec3 v_diffuseColorLight2;\n' +
	'varying vec3 v_specularColorL1;\n' +
	'varying vec3 v_specularColorL2;\n' +
	
	
	'void main() {\n' +	
	'		v_colorOpacity = u_colorOpacity;\n' +
	'		vec4 vertexNormal4;\n' +
	'		if (u_GourandShadingOn) {\n' +
	'			vertexNormal4.xyz = a_vertexNormal;\n' +
	'		}\n' +
	'		else {\n' +
	'			vertexNormal4.xyz = a_fragmentNormal;\n' +
	'		}\n' +
	'		vertexNormal4.w = 1.0;\n' + 
	'		vec4 vertexNormalTransformed4 = u_invTransformMatrix * vertexNormal4;\n' +
	'		vec3 vertexNormal = vertexNormalTransformed4.xyz;\n' +
	
	
	'		v_diffuseColorLight1 = u_colorLight1 * u_kDiffuse;\n' +
	'		vec3 u_specularColorLight1 = u_colorLight1 * u_kSpecular;\n' +		
	'		v_diffuseColorLight2 = u_colorLight2 * u_kDiffuse;\n' +   // Note vec3 * vec3 is componentwise in WebGL
	'		vec3 u_specularColorLight2 = u_colorLight2 * u_kSpecular;\n' +

	'		vec3 u_light2Dir = u_light2Position - (u_transformMatrix * a_Position).xyz;\n' +

	
	'		v_cosThetaL1 = clamp((dot(vertexNormal, u_light1Dir) / (length(vertexNormal) * length(u_light1Dir))), 0.0, 1.0);\n' + 
	'		vec3 v_diffuseColorL1 = clamp((v_cosThetaL1 * v_diffuseColorLight1), 0.0, 1.0);\n' +
	'		v_specularColorL1 =  vec3(0.0, 0.0, 0.0);\n' +

	
	'		v_cosThetaL2 = clamp((dot(vertexNormal, u_light2Dir) / (length(vertexNormal) * length(u_light2Dir))), 0.0, 1.0);\n' + 
	'		vec3 v_diffuseColorL2 = clamp((v_cosThetaL2 * v_diffuseColorLight2), 0.0, 1.0);\n' +
	'		v_specularColorL2 =  vec3(0.0, 0.0, 0.0);\n' +
	
	'		if (u_specularOn) {\n' +
	'			vec3 halfwayVecL1 = normalize(normalize(u_light1Dir) + normalize(u_viewingDir));\n' +	
	'			float cosSpecL1 = pow(max(float(0.0), dot(normalize(halfwayVecL1), normalize(vertexNormal))), u_glossyness);\n' +	
	'			v_specularColorL1 =  clamp((cosSpecL1 * u_specularColorLight1), 0.0, 1.0);\n' +	
	
	'			vec3 halfwayVecL2 = normalize(normalize(u_light2Dir) + normalize(u_viewingDir));\n' +	
	'			float cosSpecL2 = pow(max(float(0.0), dot(normalize(halfwayVecL2), normalize(vertexNormal))), u_glossyness);\n' +	
	'			v_specularColorL2 =  clamp((cosSpecL2 * u_specularColorLight2), 0.0, 1.0);\n' +			
	'		}\n' +
	
	'		vec3 v_Color_3D_L1 = vec3(0.0, 0.0, 0.0);\n' +
	'		vec3 v_Color_3D_L2 = vec3(0.0, 0.0, 0.0);\n' +
	'		if (u_light1On) {\n' +
	'			v_Color_3D_L1 = clamp((v_diffuseColorL1 + v_specularColorL1), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));\n' + 
	'		}\n' +
	'		if (u_light2On) {\n' +
	'			v_Color_3D_L2 = clamp((v_diffuseColorL2 + v_specularColorL2), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));\n' + 
	'		}\n' +

	'		v_Color.xyz = clamp((v_Color_3D_L1 + v_Color_3D_L2 + u_kAmbient), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));\n' +
	'		v_Color.w = float(1.0);\n' +
	
	'	if (u_isObject) {\n' +
	'  		gl_Position = u_ProjMatrix * u_ViewMatrix * u_transformMatrix * a_Position;\n' +
	'	}\n' +
	'	else {\n' +
	'  		gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n' +	
	'	}\n' +
	'	gl_PointSize = 5.0;\n' +           // Set point size to 5.0
	'	v_textureCoord = a_textureCoord;\n' +
	
	'}\n';
	
//String to create WebGL fragment shader for flat shading
var fragment_shader =
	'#ifdef GL_ES\n' +
	'precision mediump float;\n' +
	'#endif\n' +
	'uniform sampler2D u_Sampler;\n' +
	'uniform bool u_specularOn;\n' +
	'uniform bool u_light1On;\n' +
	'uniform bool u_light2On;\n' +
	'uniform vec3 u_kAmbient;\n' +
	
	'uniform vec4 u_SolidColor;\n' +
	'uniform bool u_drawSolidColor;\n' +
	
	'varying float v_colorOpacity;\n' + 
	'varying vec4 v_Color;\n' +
	'varying vec2 v_textureCoord;\n' +
	
	'varying float v_cosThetaL1;\n' +
	'varying float v_cosThetaL2;\n' +
	'varying vec3 v_diffuseColorLight1;\n' +
	'varying vec3 v_diffuseColorLight2;\n' +
	'varying vec3 v_specularColorL1;\n' +
	'varying vec3 v_specularColorL2;\n' +
	
	'void main() {\n' +

	'	if (u_drawSolidColor) {\n' +
	'		gl_FragColor = u_SolidColor;\n' +
	'	}\n' +
	'	else {\n' +
	'		vec4 textureColor = texture2D(u_Sampler, v_textureCoord);\n' +
 
	'		vec3 unshadedColorL1 = textureColor.rgb + (v_colorOpacity * (v_diffuseColorLight1 - vec3(1.0, 1.0, 1.0)));\n' +
	'		vec3 unshadedColorL2 = textureColor.rgb + (v_colorOpacity * (v_diffuseColorLight2 - vec3(1.0, 1.0, 1.0)));\n' +
	'		vec3 diffuseColorL1 = clamp((v_cosThetaL1 * unshadedColorL1), 0.0, 1.0);\n' +
	'		vec3 diffuseColorL2 = clamp((v_cosThetaL2 * unshadedColorL2), 0.0, 1.0);\n' + 
	
	
	'		vec3 v_Color_3D_L1 = vec3(0.0, 0.0, 0.0);\n' +
	'		vec3 v_Color_3D_L2 = vec3(0.0, 0.0, 0.0);\n' +
	'		if (u_light1On) {\n' +
	'			v_Color_3D_L1 = clamp((diffuseColorL1 + v_specularColorL1), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));\n' + 
	'		}\n' +
	'		if (u_light2On) {\n' +
	'			v_Color_3D_L2 = clamp((diffuseColorL2 + v_specularColorL2), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));\n' + 
	'		}\n' +
	
	
	'		gl_FragColor = vec4(clamp((v_Color_3D_L1 + v_Color_3D_L2 + (v_colorOpacity * u_kAmbient)), 0.0, 1.0), textureColor.a);\n' +	
	'	}\n' +
	'}\n';

	

const canvasScale = 500;
const SORrotation = 10;  // in degrees
const RIGHT_CLICK = 2;
const MIDDLE_CLICK = 1;
const LEFT_CLICK = 0;
const FLAT = 0;
const GOURAND = 1;
const ORTHO = 0;
const PERSPECTIVE = 1;
const DRAWSOR = 0;
const DRAWSCENE = 1;
DOUBLECLICKTIME = 500;

// Object sepcific
var allPoints = [];  			// Stores all clicked points (and temporarily stores current mouse location)

// Default settings
var continuePolyline = true;	// Controls whether rubber band line drawn to current mouse position
var dimensions = 3;
var objName = null;
var normalsOn = false;

lightingPosition = [500.0, 500.0, 500.0];

var light1On = true;
var light2On = true;
var view = ORTHO;

var lab1canvas;
var glContext;
var a_Position;

var allObjects = [];
var currentSOR = null;
var doubleclickSOR = null;

var fovy = 54;   //54 degrees = 2*arctan(1/2) to make the object same size as in ortho view
var eyeX = 0.0;
var eyeY = 0.0;
var eyeZ = canvasScale*2.0;

var centerX = eyeX;
var centerY = eyeY;
var centerZ = eyeZ - (canvasScale*2.0);

var origCoords = [0, 0, 0];


var light1Dir = [1.0, 1.0, 1.0];
var light2Position = [0.0, 500.0, 0.0];
var viewingDir = [eyeX, eyeY, eyeZ];
var colorLight1 = [1.0, 1.0, 1.0];
var colorLight2 = [1.0, 1.0, 0.0];

var middleClickOn = false;
var debugMode = false;
var checkingPixel = false;

	
function main() {
	
	// Get the canvas element and rendering webGL context
	lab1canvas = document.getElementById("lab1canvas");
	glContext = getWebGLContext(lab1canvas);
	lab1canvas.onselectstart = function () { return false; }
	
	
	// Print error if webGL context not fetched (if broweser does not run WebGL)
	if (!glContext) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}
	
	// Initialize the shaders, return error if that fails 
	if (!initShaders(glContext, vertex_shader, fragment_shader)) {
		console.log('Failed to intialize shaders.');
		return;
	}
	
	glContext.useProgram(glContext.program);
	
	// Get storage location of a_Position
	a_Position = glContext.getAttribLocation(glContext.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}
	
	setSceneUniforms();
	
	// Hide unnecessary buttons
	hideHTMLelements();
	
	// Display relevent button elements
	document.getElementById("loadButton").style.display = "initial";
	document.getElementById("createSORButton").style.display = "initial";	
	
	setUniformBool("u_isObject", false);
}

var SORobject = function() {
	debugPrinting();
	
	this.kDiffuse = [1.0, 0.0, 0.0];
	this.kSpecular = [0.0, 1.0, 0.0];
	this.kAmbient = [0.0, 0.0, 0.2];
	
	this.colorOpacity = 0.0;
	this.specularOn = false;
	this.shininess = 1.0;
	this.shadingType = FLAT;
	this.textureImagePath = 'text.JPG';
	this.textureName = "text";
	
	this.transformMatrix = new Matrix4();
	this.transformNormals = new Matrix4();
	this.invTransformMatrix = new Matrix4();
	
	this.scaling = new Matrix4();
	this.rotation = new Matrix4();
	this.translation = new Matrix4();
	this.origTranslation = new Matrix4();
	
	this.vertices = [];
	this.indices = [];
	
	this.repeatedVertices = [];
	this.repeatedIndices = [];
	
	this.fragmentNormalVertices = [];
	this.fragmentNormalIndices = [];
	
	this.repeatedVertexNormals = [];
	this.repeatedFragmentNormals = [];
	this.textureCoordinates = [];
	
	this.centerPosition = [0.0, 0.0, 0.0];
	
	this.transformMatrix.setIdentity();
	this.transformNormals.setIdentity();
	this.invTransformMatrix.setIdentity();
	
	this.scaling.setIdentity();
	this.rotation.setIdentity();
	this.translation.setIdentity();
	this.origTranslation.setIdentity();
	
	this.initTextures();
}

function setSceneUniforms() {
	debugPrinting();
	
	setUniformV3('u_light1Dir', light1Dir);
	setUniformV3('u_light2Position', light2Position);
	
	setUniformV3('u_colorLight1', colorLight1);
	setUniformV3('u_colorLight2', colorLight2);
	
	setUniformBool("u_light1On", light1On);
	setUniformBool("u_light2On", light2On);
}

SORobject.prototype.setObjectUniforms = function() {
	debugPrinting();
	
	setUniformV3('u_kDiffuse', this.kDiffuse);
	setUniformV3('u_kSpecular', this.kSpecular);
	setUniformV3('u_kAmbient', this.kAmbient);
	
	setUniformFloat('u_colorOpacity', this.colorOpacity);
	setUniformBool('u_GourandShadingOn', this.shadingType);
	setUniformBool('u_specularOn', this.specularOn);
	setUniformFloat('u_glossyness', this.shininess);
	
	this.setTextureBuffer();
}

function removeSceneEventListeners() {
	debugPrinting();
	
	lab1canvas.removeEventListener("mouseup", dragCamera);
	lab1canvas.removeEventListener("mouseup", dragObject);
	lab1canvas.removeEventListener('mouseup', dragObjectInZ);
	lab1canvas.removeEventListener('mouseup', rotateObject);
	lab1canvas.removeEventListener("mousedown", handleMouseClick);
	lab1canvas.removeEventListener("wheel", handleScrollWheel);
	lab1canvas.removeEventListener('mousedown', click );
	lab1canvas.removeEventListener('mousemove', rubberBandMovement);
	lab1canvas.removeEventListener('wheel', translateCameraZ);
}

function hideHTMLelements() {
	debugPrinting();
	// Hide unnecessary buttons
	document.getElementById("fileinput").style.display = "none";	
	document.getElementById("createSORButton").style.display = "none";
	document.getElementById("loadButton").style.display = "none";
	document.getElementById("extractButton").style.display = "none";
	document.getElementById("SORdrawmessage").style.display = "none";
	
	document.getElementById("showNormals").style.display = "none";
	document.getElementById("shininess").style.display = "none";
	document.getElementById("toggleView").style.display = "none";
	
	document.getElementById("materialProperties").style.display = "none"
}


SORobject.prototype.convertToRepeatedVertices = function() {
	debugPrinting();
	
	for (var i = 0; i < this.indices.length; i++) {
		this.repeatedVertices.push(this.vertices[this.indices[i]*3]);
		this.repeatedVertices.push(this.vertices[this.indices[i]*3 + 1]);
		this.repeatedVertices.push(this.vertices[this.indices[i]*3 + 2]);
		
		this.repeatedIndices.push(i);
	}
	
}

SORobject.prototype.convertToRepeatedVertexNormals = function(vertexNormals) {
	debugPrinting();
	
	if (this.hasRepeatedVertexNormals) {
		return;
	}
	this.repeatedVertexNormals = [];
	
	for (var i = 0; i < this.indices.length; i++) {
		var thisNormal = vertexNormals[this.indices[i]];
		
		this.repeatedVertexNormals.push(thisNormal[0]);
		this.repeatedVertexNormals.push(thisNormal[1]);
		this.repeatedVertexNormals.push(thisNormal[2]);
	}
	
	this.hasRepeatedVertexNormals = true;
}

SORobject.prototype.convertToRepeatedFragmentNormals = function(vertexNormals) {
	debugPrinting();
	
	if (this.hasRepeatedFragmentNormals) {
		return;
	}
	this.repeatedFragmentNormals = [];
	
	for (var triangleIndex = 0; triangleIndex < this.indices.length; triangleIndex += 3) {	
		var normal_unscaled_start = this.fragmentNormalVertices.slice(2*triangleIndex, (2*triangleIndex + 3));
		var normal_unscaled_end = this.fragmentNormalVertices.slice((2*triangleIndex + 3), (2*triangleIndex + 6));
		var normal = vector_subtract(normal_unscaled_end, normal_unscaled_start);
		
		this.repeatedFragmentNormals.push(normal[0]);
		this.repeatedFragmentNormals.push(normal[1]);
		this.repeatedFragmentNormals.push(normal[2]);
		
		this.repeatedFragmentNormals.push(normal[0]);
		this.repeatedFragmentNormals.push(normal[1]);
		this.repeatedFragmentNormals.push(normal[2]);
		
		this.repeatedFragmentNormals.push(normal[0]);
		this.repeatedFragmentNormals.push(normal[1]);
		this.repeatedFragmentNormals.push(normal[2]);
	}
	
	this.hasRepeatedFragmentNormals = true;
}


SORobject.prototype.calcTextureCoords = function() {
	debugPrinting();
	
	this.textureCoordinates = [];
	
	allPointsNumber = this.vertices.length / (3*(360/SORrotation));
	deltaImageX = 1.0 / (360/SORrotation);
	deltaImageY = 1.0 / (allPointsNumber - 1);
		
		
		/*
				(thisindex) 		(# pts + thisindex)
						X <---------- x
						| \           ^
						|   \    T2   |   
						|     \       |    
						|       \     | 
						|   T1    \   |
						V           \ |
						x-----------> x
				(thisindex + 1)		(# pts + thisindex + 1)
				*/
				
	//make array just like vertices:
	 
	
	for (var j = 0; j < (360/SORrotation); j++) {	
		for (var i = 0; i < (allPointsNumber - 1); i++)	{
			//Triangle 1
			this.textureCoordinates.push(j*deltaImageX); // x (thisindex)
			this.textureCoordinates.push(1.0 - (i*deltaImageY)); // y
			
			this.textureCoordinates.push(j*deltaImageX);
			this.textureCoordinates.push(1.0 - ((i+1)*deltaImageY));
			
			this.textureCoordinates.push((j+1)*deltaImageX);
			this.textureCoordinates.push(1.0 - ((i+1)*deltaImageY));
			
			//Triangle 2
			this.textureCoordinates.push(j*deltaImageX); // x (thisindex)
			this.textureCoordinates.push(1.0 - (i*deltaImageY)); // y
			
			this.textureCoordinates.push((j+1)*deltaImageX);
			this.textureCoordinates.push(1.0 - ((i+1)*deltaImageY));
			
			this.textureCoordinates.push((j+1)*deltaImageX);
			this.textureCoordinates.push(1.0 - (i*deltaImageY)); // y
		}
	}
	
}


function loadNewSOR() {
	debugPrinting();
	
	// Hide unnecessary buttons
	hideHTMLelements();
	
	// Display new elements
	document.getElementById("fileinput").style.display = "initial";
	document.getElementById("extractButton").style.display = "initial";
	
	setupIOSOR("fileinput");
}

function createNewSOR() {
	debugPrinting();
	
	removeSceneEventListeners();
	
	// Prompt user for obj name
	objName = null;
	currentSOR = null;
	setUniformBool("u_isObject", false);
	
	objName = prompt("Enter the name to save object with: \n(Cancel to avoid saving) ");
	if (!objName) {
		alert("Need obj name to create and save new obj!");
		return;
	}
	
	// Hide unnecessary buttons
	hideHTMLelements();
	
	// Display neccesssary elements
	document.getElementById("SORdrawmessage").style.display = "initial";
	
	
	// Reset variables to draw new polyline
	continuePolyline = true;
	allPoints = [];
	
	// Set clear color to white and clear the canvas
	glContext.clearColor(1.0, 1.0, 1.0, 1.0);
	
	setAttribute('a_Position', allPoints, 3);
	
	// Register event handler to be called on mouse event, where last parameter is whether it is a click (isClick = true) or just mouse movement (isClick = false)
	lab1canvas.addEventListener('mousedown', click );
	lab1canvas.addEventListener('mousemove', rubberBandMovement);
	
	// Disable the right click context menu
	lab1canvas.addEventListener('contextmenu', function(e)
	{
		if(e.button == RIGHT_CLICK)  // If mouse button event was a right click
		{
			e.preventDefault();
			return false;
		}
	}, false);
}
	
// Helper function to handle a mouse click	
function click(ev) {
	debugPrinting();
	var mouseButton = ev.button //check whether mouse click was right or left
	var isClick = true;
	if (continuePolyline) {
		switch (mouseButton) {
			case LEFT_CLICK: // left click
				translateAndDrawCoordinates(ev, glContext, lab1canvas, a_Position, isClick);
				break;
				
			case RIGHT_CLICK: // right click
				continuePolyline = false;  // End the polyline on right click
				translateAndDrawCoordinates(ev, glContext, lab1canvas, a_Position, isClick);
				
				// Print out he coordinates of all points on polyline that was just terminated
				printAllPointCoords(ev);
				
				// Save nth point as a right click in rightClickedPoints
				var allPointsNumber = Math.floor(allPoints.length / dimensions);
			
				// Polyline is finished, draw the SOR
				var newSORObject = new SORobject;
				newSORObject.rotatePolyline();
				newSORObject.convertToRepeatedVertices();
				allObjects.push(newSORObject);
				currentSOR = newSORObject;
				
				//Save the new SOR
				if (objName) {
					saveFile(new SOR(objName, currentSOR.vertices, currentSOR.indices));
				}
				
				glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
				drawAllSORs();
				
				break;
				
			default: // is neither left nor right click, ignore
				return;
		}
	}
}

// Helper function to handle mouse movement event
function rubberBandMovement(ev) {
	debugPrinting();
	var isClick = false; 

	// Only translate and render coordinates of mouse position if right click did not just occur
	if (continuePolyline) {
		translateAndDrawCoordinates(ev, glContext, lab1canvas, a_Position, isClick);
	}
}

function translateCoordinates(ev) {
	debugPrinting();
	var coords = [];
	var x = ev.clientX;
	var y = ev.clientY;
	var boundingRect = ev.target.getBoundingClientRect();
	
	// Translate x, y to new x, y
	x = canvasScale*((x - boundingRect.left) - lab1canvas.width/2)/(lab1canvas.width/2);
	y = canvasScale*(lab1canvas.height/2 - (y - boundingRect.top))/(lab1canvas.height/2);
	z = 0;
	
	coords.push(x);
	coords.push(y);
	coords.push(z);
	return coords;
}

// Helper function to translate from (x, y) coordinates registered by mouse events to the WebGL rendering coordinates, then render the current polyline
function translateAndDrawCoordinates(ev, glContext, lab1canvas, a_Position, isClick) {
	debugPrinting();
	
	// Get click coordinates
	var coords = translateCoordinates(ev);
	
	//Push the newly translated point onto the stores array of points
	allPoints.push(coords[0]);
	allPoints.push(coords[1]);
	allPoints.push(coords[2]);
	
	// Get total number of points saved in allPoints
	var allPointsNumber = Math.floor(allPoints.length / dimensions);
	
	//Now add point for the line dividing left and right half of canvas
	allPoints.push(0.0*canvasScale);
	allPoints.push(1.0*canvasScale); // Top
	allPoints.push(0.0*canvasScale);
	
	allPoints.push(0.0*canvasScale);
	allPoints.push((-1.0*canvasScale));  //bottom
	allPoints.push(0.0*canvasScale);
	
	// Create a buffer object for 3D rendering
	setAttribute('a_Position', allPoints, 3); 
	
	// Echo coordinates of newest mouse click
	if (isClick) {  // CHeck that mouse event was click, not movement
		var mouseButton = ev.button; // Check whether mouse click was left or right
		var buttonString = "";
		switch (mouseButton) {
			case 0:
				buttonString = "left";
				break;
			case 2:
				buttonString = "right";
				break;
			default:
				return;
		}
		
		// Index of nth point's xy coordinates in allPoints is x = allPoints[2*n - 2], y = allPoints[2*n -1]
		console.log(buttonString + " click coordinates: [" + allPoints[dimensions*allPointsNumber - dimensions] + ", " + allPoints[dimensions*allPointsNumber - (dimensions + 1)] + "]\n");
	}
	
	// Change the drawing color to black
	var color = [0.0, 0.0, 0.0];
	
	//setSolidColor(glContext, color);
	setSolidColor(glContext, color);
	setUniformBool('u_drawSolidColor', true);
	
	// Set the position to an orthographic viewing position and pass to vertex shader
	setViewPosition(DRAWSOR);
	
	//Clear the canvas
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
	
	
	//Draw the line dividing the left and right half of the canvas
	glContext.drawArrays(glContext.LINE_STRIP, allPointsNumber, 2);
	
	
	//Pop coordinates of center line
	for (var i = 0; i < 2*dimensions; i++) {
		allPoints.pop();
	}
	
	// Draw lines segments and points by iterating through all clicked points in allPoints
	glContext.drawArrays(glContext.LINE_STRIP, 0, allPointsNumber);
	glContext.drawArrays(glContext.POINTS, 0, allPointsNumber);
	
	
	// If mouse event was just movement, not a click, need to remove from allPoints so it is not added to list of saved points
	if (!isClick) {
		allPoints.pop(); // pops current mouse location's x coordinate
		allPoints.pop(); // pops current mouse location's y coordinate
		allPoints.pop(); // pops the current mouse location's z coordinate
	}
}

/* Rotates all points in the polyline by increments of 10 degrees to get coordinates for SOR */
SORobject.prototype.rotatePolyline = function() {
	debugPrinting();
	
	// Clear vertices and indices for new SOR
	this.vertices = [];
	this.indices = [];
	this.fragmentNormalVertices = [];
	this.fragmentNormalIndices = [];
	this.fragmentColors = [];
	var allPointsNumber = Math.floor(allPoints.length / dimensions);
	
	var degrees;
	var rotationMatrix;
	var point;
	var rotatedPt;
	var rotatedPtCoords;
	
	var x, y, z;
	
	for (var nthRotation = 0; nthRotation < (360/SORrotation); nthRotation += 1) {
		
		// Create the rotation matrix to rotate the point by 'degrees' 
		degrees = nthRotation*(SORrotation);
		rotationMatrix = new Matrix4;
		rotationMatrix.setRotate(degrees, 0, 1, 0); // Rotate by 'degrees' around y axis
		
		for (var i = 0; i < allPointsNumber; i += 1) {
			x = allPoints[dimensions*i];			// Since 2 value in allPoints for every point
			y = allPoints[dimensions*i + 1];		
			z = allPoints[dimensions*i + 2];
			
			// Create vector representing a point with (x, y, z, coordinates)
			point = new Vector3(new Float32Array([x, y, z]));
		
			//Multiply by rotation matrix to rotate the point
			rotatedPt = rotationMatrix.multiplyVector3(point);   
			rotatedPtCoords = rotatedPt.elements;
			
			// Push coordinates of the newly rotated shape
			this.vertices.push(rotatedPtCoords[0]);  // x
			this.vertices.push(rotatedPtCoords[1]);	// y
			this.vertices.push(rotatedPtCoords[2]);	// z
			
			// Index in vertices array of the point which was just added
			var thisIndex = (nthRotation*allPointsNumber + i);
			
			// For all points except the last point in the polyline, draw connecting triangles
			if (i < (allPointsNumber - 1)) {
				// For last rotated point, connecting triangle should connect to original unrotated point
				if (nthRotation == (360/SORrotation - 1)) {
					// Triangle 1:
					this.indices.push(thisIndex);
					this.indices.push(thisIndex + 1);
					this.indices.push(i + 1);
					
					// Triangle 2:
					this.indices.push(thisIndex);
					this.indices.push(i + 1);
					this.indices.push(i);
				}
				else {
				
				/*
				(thisindex) 		(# pts + thisindex)
						X <---------- x
						| \           ^
						|   \    T2   |   
						|     \       |    
						|       \     | 
						|   T1    \   |
						V           \ |
						x-----------> x
				(thisindex + 1)		(# pts + thisindex + 1)
				*/
				
				// Triangle 1:
				this.indices.push(thisIndex);
				this.indices.push(thisIndex + 1);
				this.indices.push(thisIndex + allPointsNumber + 1);
				
				// Triangle 2:
				this.indices.push(thisIndex);
				this.indices.push(thisIndex + allPointsNumber + 1);
				this.indices.push(thisIndex + allPointsNumber);
				}
			}
		}
	}
	this.calcFragmentNormals();
	this.calcVertexNormals();
	this.calcTextureCoords();
	this.calcOrigTranslation();
}


function selectObject(ev) {
	debugPrinting();
	var picked = false;
	var xOrig = ev.clientX;
	var yOrig = ev.clientY;
	var pixels = new Uint8Array(4);
	
	var rect = ev.target.getBoundingClientRect();
	if (rect.left <= x || x < rect.right || rect.top <= y || y < rect.bottom) {
		return;
	}
      // If pressed position is inside <canvas>, check if it is above object
	var x = xOrig - rect.left;
	var y = rect.bottom - yOrig;
	
	
	drawLight1(true);  // Will draw in blue if checking whether on
	glContext.readPixels(x, y, 1, 1, glContext.RGBA, glContext.UNSIGNED_BYTE, pixels);
	if ((pixels[0] == 0) && (pixels[1] == 0) && (pixels[2] == 255)) {
		togglelight1();
	}
	
	drawLight2(true);  // Will draw in blue if checking whether on
	glContext.readPixels(x, y, 1, 1, glContext.RGBA, glContext.UNSIGNED_BYTE, pixels);
	if ((pixels[0] == 0) && (pixels[1] == 0) && (pixels[2] == 255)) {
		togglelight2();
	}
	else {
		drawAllSORs();
	}
}

/* Given an array vertices of vertex coordinates and an array indices indicating the connections between vertices, render the from (0, 0, +z) view of a 3D object */ 
SORobject.prototype.drawSOR = function() {
	debugPrinting();
	var indicesNew = new Uint16Array(this.repeatedIndices);
	
	if (!initShaders(glContext, vertex_shader, fragment_shader)) {
		console.log('Failed to intialize shaders.');
		return;
	}
	setViewPosition(DRAWSCENE);
	setUniformBool("u_isObject", true);
	
	setSceneUniforms();
	this.setObjectUniforms();
	
	setColorSliderValues();
	setOpacitySliderValue();
	
	// Create a buffer object for 3D rendering
	var indexBuffer = glContext.createBuffer();
	if (!indexBuffer) {
		return -1;
	 }
	
	
	this.setTransformMatrix();

	setAttribute('a_Position', this.repeatedVertices, 3);
	setAttribute('a_vertexNormal', this.repeatedVertexNormals, 3);
	setAttribute('a_fragmentNormal', this.repeatedFragmentNormals, 3);
	setAttribute('a_textureCoord', this.textureCoordinates, 2);
	

	// Write the indices to the buffer object
	glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
	glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, indicesNew, glContext.STATIC_DRAW);
		
	// Clear color buffer
	glContext.enable(glContext.DEPTH_TEST);

	
	//Now draw the different fragments
	if (this === currentSOR) {
		var gray = [0.5, 0.5, 0.5];
		setUniformBool('u_drawSolidColor', true);
		setSolidColor(glContext, gray);
		glContext.drawElements(glContext.TRIANGLES, indicesNew.length, glContext.UNSIGNED_SHORT, 0);
		setUniformBool('u_drawSolidColor', false);
	}
	
	glContext.drawElements(glContext.TRIANGLES, indicesNew.length, glContext.UNSIGNED_SHORT, 0);
	
	// Hide unnecessary buttons
	hideHTMLelements();
	
	// Display new buttons
	document.getElementById("loadButton").style.display = "initial";
	document.getElementById("createSORButton").style.display = "initial";
	document.getElementById("showNormals").style.display = "initial";
	document.getElementById("toggleView").style.display = "initial";
	
	document.getElementById("loadButton").style.display = "initial";
	document.getElementById("createSORButton").style.display = "initial";
	
	if (currentSOR) {
		document.getElementById("materialProperties").style.display = "initial";
		if (currentSOR.specularOn) {
			document.getElementById("shininess").style.display = "initial";
		}
	}
	
	// Check if normals are on, and if so render the normals as well
	if (normalsOn) {
		if ((this.fragmentNormalVertices.length == 0) || (this.fragmentNormalVertices.length == 0)) {
			console.log("Normals not calculated!!!!!");
			return;
		}
		this.drawNormals();
	}
	
	//glContext.bindTexture(glContext.TEXTURE_2D, null);
}



// Helper function to print out all the saved (clicked) point coordinates of current polyline (since previous right click)
function printAllPointCoords(ev) {
	debugPrinting();
	var allPointsLen = allPoints.length;
	console.log("\nAll mouse clicks:")
	
	// Iterate through all the points that were saved in allPoints
	for(var i = 0; i < allPointsLen; i += dimensions) {
		console.log("[" + allPoints[i].toString() + ", " + allPoints[i+1] + "]");
		
	}
	console.log("\n");
}


function toggleUniform(uniformName) {
	debugPrinting();
	uniformName = (!uniformName); 

	drawAllSORs();
	return uniformName;
}


// Switch the value normalsOn variable, and then redraw the SOR
function toggleNormals() {
	debugPrinting();
	if (normalsOn) {
		normalsOn = false;
	}
	else {  		// shadingType == GOURAND
		normalsOn = true;
	}
	drawAllSORs();
}

// Switch type of shading from flat to Gourand or vice versa
function toggleShading() {
	debugPrinting();
	
	if (!currentSOR) {
		console.log("NO OBJECTS SELECTED!!!");
		return;
	}
	
	if (currentSOR.shadingType == FLAT) {
		currentSOR.shadingType = GOURAND;
	}
	else {  		// shadingType == GOURAND
		currentSOR.shadingType = FLAT;
	}

	drawAllSORs();
}

// Switch type of shading from flat to Gourand or vice versa
function toggleSpecular() {
	debugPrinting();
	
	if (!currentSOR) {
		console.log("NO OBJECTS SELECTED!!!");
		return;
	}
	
	if (currentSOR.specularOn) {
		currentSOR.specularOn = false;
	}
	else {  		// shadingType == GOURAND
		currentSOR.specularOn = true;
	}

	drawAllSORs();
}

/*Switch light 1 on and off*/
function togglelight1() {
	debugPrinting();
	if (light1On) {
		light1On = false;
	}
	else {
		light1On = true;
	}
	setUniformBool("u_light1On", light1On);
	drawAllSORs();
	
}

/*Switch light 2 on and off*/
function togglelight2() {
	debugPrinting();
	if (light2On) {
		light2On = false;
	}
	else {
		light2On = true;
	}
	setUniformBool("u_light2On", light2On);
	drawAllSORs();
}

/*Change the shininess */
function changeShininess(newValue) {
	debugPrinting();
	
	if (!currentSOR) {
		console.log("NO OBJECTS SELECTED!!!");
		return;
	}
	
	currentSOR.shininess = newValue;
	setUniformFloat('u_glossyness', currentSOR.shininess);
	drawAllSORs();
}

function changeOpacity(newOpacity) {
	debugPrinting();
	
	if (!currentSOR) {
		console.log("NO OBJECTS SELECTED!!!");
		return;
	}
	
	currentSOR.colorOpacity = newOpacity;
	
	setUniformFloat('u_colorOpacity', currentSOR.colorOpacity);
	drawAllSORs();
}


function changeTexture(newTexture) {
	debugPrinting();
	
	if (!currentSOR) {
		console.log("NO OBJECTS SELECTED!!!");
		return;
	}
	
	currentSOR.textureName = newTexture;
	switch(currentSOR.textureName) {
		case "text":
			currentSOR.textureImagePath = 'text.JPG';
			break;
		case "mountains":
			currentSOR.textureImagePath = 'mountains.JPG';
			break;
		case "cityscape":
			currentSOR.textureImagePath = 'cityscape.JPG';
			break;
		case "noTexture":
			currentSOR.textureImagePath = 'blank.jpg';
			break;
	}
	currentSOR.initTextures();
}


/* Toggles between ortho and perspective views*/
function toggleView() {
	debugPrinting();
	if (view == ORTHO) {
		view = PERSPECTIVE;
	}
	else {
		view = ORTHO;
	}
	
	
	setViewPosition(DRAWSCENE);
	
	drawAllSORs();
	
}


function setUniformBool(name, value) {
	debugPrinting();
	var uniformBoolLocation = glContext.getUniformLocation(glContext.program, name);
	if (uniformBoolLocation < 0) { 
		console.log('Failed to get the storage location of ' + name);
		return false;
	}
	glContext.uniform1i(uniformBoolLocation, value);
}


function handleMouseClick(ev) {
	debugPrinting();
	middleClickOn = false;
	
	switch (ev.button) {
		case LEFT_CLICK:
			checkClickedOnLight(ev, false);
			break;
		case MIDDLE_CLICK:
			middleClickOn = true;
			startZtranslation(ev);
			break;
		case RIGHT_CLICK:
			examine(ev);
			startObjRotation(ev);
			break;
		default:
			return;
	}
	
}


/*When mouse wheel is scrolled, scale selected object*/
function handleScrollWheel(ev) {
	debugPrinting();
	if (!currentSOR) {
		if (middleClickOn) {
			translateCameraZ(ev);
		}
		else {
			zoomScene(ev);
		}
	}
	else {
		scaleObject(ev);
	}
	return false;
}

function scaleObject(ev) {
	debugPrinting();
	var maxScaling = 2.0;
	var minScaling = 0.5;
	var scaleStep = 250*10;
	var scaling;
	
	var scaleDelta = ev.deltaY;
	if (scaleDelta > 0) {
		scaling = Math.min(maxScaling, (1 + (scaleDelta / scaleStep)) );
	}
	else {
		scaling = Math.max(minScaling, (1 + (scaleDelta / scaleStep)));
	}
	
	transformSelectedObj("scale", scaling, scaling, scaling);
	drawAllSORs();
}

function zoomScene(ev) {
	debugPrinting();
	var maxZoom = 2.0;
	var minZoom = 0.5;
	var zoomStep = 250*10;
	
	var zoomDelta = ev.deltaY;
	if (zoomDelta > 0) {
		fovy = fovy*Math.min(maxZoom, (1 + (zoomDelta / zoomStep)) );
	}
	else {
		fovy = fovy*Math.max(minZoom, (1 + (zoomDelta / zoomStep)) );
	}
	
	setViewPosition(DRAWSCENE);
	drawAllSORs();
}



function translateCameraZ(ev) {
	debugPrinting();
	var maxZoom = 2.0;
	var minZoom = 0.5;
	var zoomStep = 250*10;
	
	var zoomDelta = ev.deltaY;
	if (zoomDelta > 0) {
		eyeZ = eyeZ*Math.min(maxZoom, (1 + (zoomDelta / zoomStep)) );
	}
	else {
		eyeZ = eyeZ*Math.max(minZoom, (1 + (zoomDelta / zoomStep)) );
	}
	centerZ = eyeZ - (canvasScale*2.0);
	
	viewingDir = [eyeX, eyeY, eyeZ];
	setUniformV3('u_viewingDir', viewingDir);
	
	setViewPosition(DRAWSCENE);
	drawAllSORs();
}

function translateCameraXY(ev) {
	debugPrinting();
	drawAllSORs();
	lab1canvas.onmouseup = function(ev) {dragCamera(ev)};
	return;
}

function dragCamera(ev) {
	debugPrinting();
	if (currentSOR) {
		return;
	}
	var newCoords = translateCoordinates(ev);
	
	eyeX = eyeX + (newCoords[0] - origCoords[0]);
	eyeY = eyeY + (newCoords[1] - origCoords[1]);
	
	centerX = eyeX;
	centerY = eyeY;

	viewingDir = [eyeX, eyeY, eyeZ];
	setUniformV3('u_viewingDir', viewingDir);
	
	setViewPosition(DRAWSCENE);
	drawAllSORs();
}


function startZtranslation(ev) {
	debugPrinting();
	if (!currentSOR) {
		return;
	}
	
	lab1canvas.addEventListener('mouseup', dragObjectInZ);
}

function startObjRotation(ev) {
	debugPrinting();
	if (!currentSOR) {
		return;
	}

	lab1canvas.addEventListener('mouseup', rotateObject);
}

/*Check the whenter the click */
function checkClickLocationOnObject(ev, thisObject) {
	debugPrinting();
	checkingPixel = true;
	
	xOrig = ev.clientX;
	yOrig = ev.clientY;
	var pixels = new Uint8Array(4);
	
	var rect = ev.target.getBoundingClientRect();
	if (rect.left <= x || x < rect.right || rect.top <= y || y < rect.bottom) {
		return;
	}
      // If pressed position is inside <canvas>, check if it is above object
	var x = xOrig - rect.left;
	var y = rect.bottom - yOrig;
	
	glContext.clearColor(1.0, 1.0, 1.0, 1.0);
	glContext.clear(glContext.COLOR_BUFFER_BIT);
	
	
	thisObject.drawSOR();
	glContext.readPixels(x, y, 1, 1, glContext.RGBA, glContext.UNSIGNED_BYTE, pixels);
	
	if ((pixels[0] != 255) || (pixels[1] != 255) || (pixels[2] != 255)) {
		checkingPixel = false;
		return true;
	}
	checkingPixel = false;
	return false;
}

function setColorSliderValues() {
	if (!currentSOR) {
		return;
	}
	
	console.log("currentSOR.textureName.toString(): " + currentSOR.textureName);
	document.getElementById("selectTexture").value = currentSOR.textureName;
	
	document.getElementById("useGourandCheckbox").checked = currentSOR.shadingType;
	document.getElementById("useSpecularCheckbox").checked = currentSOR.specularOn;
	document.getElementById("shinynessSlider").value = currentSOR.shininess.toString();
	
	
	var rDiffuse = currentSOR.kDiffuse[0];
	var gDiffuse = currentSOR.kDiffuse[1];
	var bDiffuse = currentSOR.kDiffuse[2];
	
	document.getElementById("redSlider").value = rDiffuse.toString();
	document.getElementById("greenSlider").value = gDiffuse.toString();
	document.getElementById("blueSlider").value = bDiffuse.toString();
	
	var diffCanvasSwatch = document.getElementById("diffuseColorCanvas").getContext("2d");
	diffCanvasSwatch.fillStyle = "rgb(" + (Math.floor(255*rDiffuse)).toString() + ", " + (Math.floor(255*gDiffuse)).toString() + ", " + (Math.floor(255*bDiffuse)).toString() + ")";
	
	diffCanvasSwatch.fillRect(0, 0, 20, 10);
	diffCanvasSwatch.fill();
	
	
	var rSpecular = currentSOR.kSpecular[0];
	var gSpecular = currentSOR.kSpecular[1];
	var bSpecular = currentSOR.kSpecular[2];
	
	document.getElementById("redSpecSlider").value = rSpecular.toString();
	document.getElementById("greenSpecSlider").value = gSpecular.toString();
	document.getElementById("blueSpecSlider").value = bSpecular.toString();

	var specCanvasSwatch = document.getElementById("specColorCanvas").getContext("2d");
	specCanvasSwatch.fillStyle = "rgb(" + (Math.floor(255*rSpecular)).toString() + ", " + (Math.floor(255*gSpecular)).toString() + ", " + (Math.floor(255*bSpecular)).toString() + ")";
	
	specCanvasSwatch.fillRect(0, 0, 20, 10);
	specCanvasSwatch.fill();
	
	
	var rAmbient = currentSOR.kAmbient[0];
	var gAmbient = currentSOR.kAmbient[1];
	var bAmbient = currentSOR.kAmbient[2];
	
	document.getElementById("redAmbientSlider").value = rAmbient.toString();
	document.getElementById("greenAmbientSlider").value = gAmbient.toString();
	document.getElementById("blueAmbientSlider").value = bAmbient.toString();

	var ambientCanvasSwatch = document.getElementById("ambientColorCanvas").getContext("2d");
	ambientCanvasSwatch.fillStyle = "rgb(" + (Math.floor(255*rAmbient)).toString() + ", " + (Math.floor(255*gAmbient)).toString() + ", " + (Math.floor(255*bAmbient)).toString() + ")";
	
	ambientCanvasSwatch.fillRect(0, 0, 20, 10);
	ambientCanvasSwatch.fill();
}

function setOpacitySliderValue() {
	if (!currentSOR) {
		return;
	}
	
	var colorOpacity = currentSOR.colorOpacity;
	
	document.getElementById("opacitySlider").value = colorOpacity.toString();
}


function checkClickedOnLight(ev, dblClick) {
	debugPrinting();
	removeSceneEventListeners();
	
	xOrig = ev.clientX;
	yOrig = ev.clientY;
	var pixels = new Uint8Array(4);
	
	var rect = ev.target.getBoundingClientRect();
	if (rect.left <= x || x < rect.right || rect.top <= y || y < rect.bottom) {
		return;
	}
      // If pressed position is inside <canvas>, check if it is above object
	var x = xOrig - rect.left;
	var y = rect.bottom - yOrig;
	
	origCoords = translateCoordinates(ev);
	glContext.clearColor(1.0, 1.0, 1.0, 1.0);
	glContext.clear(glContext.COLOR_BUFFER_BIT);
	for (var i = 0; i < allObjects.length; i++) {
		var thisObject = allObjects[i];
		if (checkClickLocationOnObject(ev, thisObject))	{
			currentSOR = allObjects[i];
			drawAllSORs();
			doubleclickSOR = currentSOR;
			lab1canvas.addEventListener('dblclick', lookaround);
			lab1canvas.addEventListener('mouseup', dragObject);
			return;
		}
	}
	currentSOR = null;
	
	// Check if light 1 selected
	drawLight1(true);  // Will draw in blue if checking whether on
	glContext.readPixels(x, y, 1, 1, glContext.RGBA, glContext.UNSIGNED_BYTE, pixels);
	if ((pixels[0] == 0) && (pixels[1] == 0) && (pixels[2] == 255)) {
		togglelight1();
	}
	
	// Check if light 2 selected
	drawLight2(true);  // Will draw in blue if checking whether on
	glContext.readPixels(x, y, 1, 1, glContext.RGBA, glContext.UNSIGNED_BYTE, pixels);
	if ((pixels[0] == 0) && (pixels[1] == 0) && (pixels[2] == 255)) {
		togglelight2();
	}
	else {
		if ((ev.button == RIGHT_CLICK) && (currentSOR)) {
			examine();
			return;
		}
		
		drawAllSORs();
		lab1canvas.addEventListener('mouseup', dragCamera);
	}

}

/*Draws all the the SORs and the lights*/
function drawAllSORs() {
	debugPrinting();
	
	glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);	
	for (var i = 0; i < allObjects.length; i++) {
		thisObject = allObjects[i];
		thisObject.drawSOR();
		//thisObject.drawWithTextures();
	}
	
	// Render the light sources
	drawLight1(false);  
	drawLight2(false); 
	
	removeSceneEventListeners();
	
	lab1canvas.addEventListener('dblclick', lookaround);
	lab1canvas.addEventListener('mousedown', handleMouseClick);
	lab1canvas.addEventListener('wheel', handleScrollWheel);
	
	// Disable the right click context menu
	lab1canvas.addEventListener('contextmenu', function(e)
	{
		if(e.button == RIGHT_CLICK)  // If mouse button event was a right click
		{
			e.preventDefault();
			return false;
		}
		
	}, false);
}



function dragObjectInZ(ev) {
	debugPrinting();
	
	if (!currentSOR) {
		return;
	}
	var newCoords = translateCoordinates(ev);
	
	// Use vertical movement y dir to z-displacement
	transformSelectedObj("translate", 0, 0, (newCoords[1] - origCoords[1]));
	drawAllSORs();
}

function dragObject(ev) {
	debugPrinting();
	
	if (!currentSOR) {
		return;
	}
	var newCoords = translateCoordinates(ev);
	
	transformSelectedObj("translate", (newCoords[0] - origCoords[0]), (newCoords[1] - origCoords[1]), 0);
	drawAllSORs();
}

/*Rotates an object in repsonse to a right mouse click */
function rotateObject(ev) {
	debugPrinting();
	
	if (!currentSOR) {
		return;
	}
	var newCoords = translateCoordinates(ev);
	
	rotationScale = 50/canvasScale;  // Arbitrary, but reasonable amount of rotation per ouse translation
	
	// If movement is mostly horizontal, rotate about z-axis
	if (Math.abs(newCoords[0] - origCoords[0]) > Math.abs(newCoords[1] - origCoords[1])) {
		transformSelectedObj("rotate", 0, 0, rotationScale*(newCoords[0] - origCoords[0]));
	}
	else {  // Otherwise rotate about x-axis
		transformSelectedObj("rotate", rotationScale*(newCoords[1] - origCoords[1]), 0, 0);
	}
	drawAllSORs();
}

/* Rotates camera view around the currentSOR */
function examine(ev) {
	debugPrinting();
	if (!currentSOR) {
		return;
	}
	if (checkClickLocationOnObject(ev, currentSOR)) {
		drawAllSORs();
		return;
	}
	
	var savedCurrentSOR = currentSOR;
	// Get center coordinates of object of interest
	var translatedCenterPos = currentSOR.getTranslatedCenterPosition();
	
	currentSOR = null;
	
	// Get the max xy offset, set raduis accordingly
	var radius = 500;

	var eyeXOrig = eyeX;
	var eyeYOrig = eyeY;
	var eyeZOrig = eyeZ;
	
	var centerXOrig = centerX;
	var centerYOrig = centerY;
	var centerZOrig = centerZ;
	
	var degree = 0;
		
	eyeY = translatedCenterPos[1];
	centerX = translatedCenterPos[0];
	centerY = translatedCenterPos[1];
	centerZ = translatedCenterPos[2];
	
	var viewIncrement = setInterval( 
		function() {
			
			eyeX = translatedCenterPos[0] + radius*Math.sin(degree * Math.PI / 180);
			eyeZ = translatedCenterPos[2] + radius*Math.cos(degree * Math.PI / 180);
		
			drawAllSORs();
			removeSceneEventListeners();
			
			degree++;
			if (degree > 360) {
				
				// Return to original view
				eyeX = eyeXOrig;
				eyeY = eyeYOrig;
				eyeZ = eyeZOrig;
				
				centerX = centerXOrig;
				centerY = centerYOrig;
				centerZ = centerZOrig;
				
				currentSOR = savedCurrentSOR;
				drawAllSORs();
				clearInterval(viewIncrement);
			}
	}, 100);
}


/* Rotates camera view from inside the center of the current SOR */
function lookaround(ev) {
	debugPrinting();
	
	currentSOR = doubleclickSOR;
	
	if (!currentSOR) {
		drawAllSORs();
		return;
	}
	
	var savedCurrentSOR = currentSOR;
	var translatedCenterPos = currentSOR.getTranslatedCenterPosition();
	currentSOR = null;
	
	var eyeXOrig = eyeX;
	var eyeYOrig = eyeY;
	var eyeZOrig = eyeZ;
	
	var centerXOrig = centerX;
	var centerYOrig = centerY;
	var centerZOrig = centerZ;
	
	centerY = translatedCenterPos[1];

	eyeX = translatedCenterPos[0];
	eyeY = translatedCenterPos[1];
	eyeZ = translatedCenterPos[2];
	
	var degree = 0;
	var viewIncrement = setInterval( 
		function() {
			
			centerX = translatedCenterPos[0] + Math.sin(-degree * Math.PI / 180);
			centerZ = translatedCenterPos[2] + Math.cos(-degree * Math.PI / 180);
		
			drawAllSORs();
			removeSceneEventListeners();
			
			degree++;
			if (degree > 360) {
				
				// Return to original view
				eyeX = eyeXOrig;
				eyeY = eyeYOrig;
				eyeZ = eyeZOrig;
				
				centerX = centerXOrig;
				centerY = centerYOrig;
				centerZ = centerZOrig;
				
				currentSOR = savedCurrentSOR;
				doubleclickSOR = null;
				
				drawAllSORs();
				clearInterval(viewIncrement);
			}
	}, 100);
	
}


/* Iterate through all trio's of points indices in 'indices' array, and for each trio of points 
calculate the normal of the plane spanning those points, and then save point coordinates and 
indices to display the normal of to the plane*/
SORobject.prototype.calcFragmentNormals = function() {
	debugPrinting();

	// Clear previous contents of fragmentNormalVertices an fragmentNormalIndices arrays
	this.fragmentNormalVertices = [];
	this.fragmentNormalIndices = [];
	
	// Loop through the traingles defined in indices, find normal for each line loop for each
	for (var triangleIndex = 0; triangleIndex < this.indices.length; triangleIndex += 3) {
		
		// Get x coord of all three points in triangle
		var pt_1x = this.vertices[this.indices[triangleIndex]*3];
		var pt_2x = this.vertices[this.indices[triangleIndex + 1]*3];
		var pt_3x = this.vertices[this.indices[triangleIndex + 2]*3];
		
		var v1_x = pt_2x - pt_1x;		// x-coord of vector from pt_1 to p_t2
		var v2_x = pt_3x - pt_2x;		// x-coord of vector from pt_2 to p_t3
		
		// Get x coord of all three points in triangle
		var pt_1y = this.vertices[this.indices[triangleIndex]*3 + 1];
		var pt_2y = this.vertices[this.indices[triangleIndex + 1]*3 + 1];
		var pt_3y = this.vertices[this.indices[triangleIndex + 2]*3 + 1];
		
		var v1_y = pt_2y - pt_1y;		// y-coord of vector from pt_1 to p_t2
		var v2_y = pt_3y - pt_2y;		// y-coord of vector from pt_2 to p_t3
		
		// Get z coord of all three points in triangle
		var pt_1z = this.vertices[this.indices[triangleIndex]*3 + 2];
		var pt_2z = this.vertices[this.indices[triangleIndex + 1]*3 + 2];
		var pt_3z = this.vertices[this.indices[triangleIndex + 2]*3 + 2];
		
		var v1_z = pt_2z - pt_1z;		// z-coord of vector from pt_1 to p_t2
		var v2_z = pt_3z - pt_2z;		// z-coord of vector from pt_2 to p_t3
		
		// Now calculate x, y, and z, of cross product v1 x v2, since both will be in plane 
		var cp_x = v1_y*v2_z - v1_z*v2_y;
		var cp_y = v1_z*v2_x - v1_x*v2_z;
		var cp_z = v1_x*v2_y - v1_y*v2_x;
		
		//Put normal coordinates into Vector3 object to normalize, then extract normalized elements
		var normal_v = new Vector3(new Float32Array([cp_x, cp_y, cp_z]));
		normal_v = normal_v.normalize();
		normal_v_coords = normal_v.elements;
		
		// Get scale factor for normals based on canvas size
		scaleFactor = canvasScale*(lab1canvas.width/8000);
		
		// Get middle point in the face
		var face_center_x = (pt_1x + pt_2x + pt_3x) / 3;
		var face_center_y = (pt_1y + pt_2y + pt_3y) / 3;
		var face_center_z = (pt_1z + pt_2z + pt_3z) / 3;
		
		// Push start point of displayed normal, which will be middle of face
		this.fragmentNormalVertices.push(face_center_x);  // x
		this.fragmentNormalVertices.push(face_center_y);	// y
		this.fragmentNormalVertices.push(face_center_z);	// z
		
		// Push coordinates of endpoint of displayed normal, which will be: (middle of face) + (normal vector)
		this.fragmentNormalVertices.push(scaleFactor*normal_v_coords[0] + face_center_x);  // x
		this.fragmentNormalVertices.push(scaleFactor*normal_v_coords[1] + face_center_y);	// y
		this.fragmentNormalVertices.push(scaleFactor*normal_v_coords[2] + face_center_z);	// z
		
		this.fragmentNormalIndices.push(2*triangleIndex/3);				//Index of normal start point
		this.fragmentNormalIndices.push((2*triangleIndex/3) + 1);		//Index of normal end point
		
	}
	this.convertToRepeatedFragmentNormals();
}

/* Retrieves the position of center of fragment given it's triangle index*/
SORobject.prototype.getFragmentPosition = function(triangleIndex) {
	debugPrinting();
	
	var position = [];
	
	var pt1 = [];
	var pt2 =  [];
	var pt3 = [];
	
	pt1.push( this.vertices[this.indices[triangleIndex]*3] );
	pt1.push( this.vertices[this.indices[triangleIndex]*3 + 1] );
	pt1.push( this.vertices[this.indices[triangleIndex]*3 + 2] );
	
	pt2.push( this.vertices[this.indices[triangleIndex + 1]*3] );
	pt2.push( this.vertices[this.indices[triangleIndex + 1]*3 + 1] );
	pt2.push( this.vertices[this.indices[triangleIndex + 1]*3 + 2] );
	
	pt3.push( this.vertices[this.indices[triangleIndex + 2]*3] );
	pt3.push( this.vertices[this.indices[triangleIndex + 2]*3 + 1] );
	pt3.push( this.vertices[this.indices[triangleIndex + 2]*3 + 2] );
	
	// Middle is the mean of the the fragments corner vertices
	position.push((pt1[0] + pt2[0] + pt3[0])/3);
	position.push((pt1[1] + pt2[1] + pt3[1])/3);
	position.push((pt1[2] + pt2[2] + pt3[2])/3);
	return position;
}


/*Get mean value of object (it's center) and get offset from world origin*/
SORobject.prototype.calcOrigTranslation = function() {
	debugPrinting();
	
	this.origTranslation.setIdentity();
	
	var centerPositionSum = [0, 0, 0];
	var thisVertex = [0, 0, 0];
	var points = 0;
	
	for (var i = 0; i < this.vertices.length; i+= 3) {
		thisVertex = [this.vertices[i], this.vertices[i + 1], this.vertices[i + 2]];
		centerPositionSum = vector_add(centerPositionSum, thisVertex);
		points++;
	}
	
	this.centerPosition[0] = centerPositionSum[0] / points; 
	this.centerPosition[1] = centerPositionSum[1] / points; 
	this.centerPosition[2] = centerPositionSum[2] / points; 
	
	this.origTranslation.translate(this.centerPosition[0], this.centerPosition[1], this.centerPosition[2]);
}


/*Calculate the color of all the fragments of SOR for flat shading*/
SORobject.prototype.calcFragmentColors = function() {
	debugPrinting();
	
	this.fragmentColors = [];
	this.fragmentColorsSpectralPartial = [];
	
	/*Loop through all the fragments defined in indices, calculating the color for the plane 
	represented by each trio of indices at triangleIndex, and save colors in a the array 
	fragmentColors*/
	for (var triangleIndex = 0; triangleIndex < this.indices.length; triangleIndex += 3) {
		var color = this.calcFragmentColor(triangleIndex, false);
		this.fragmentColors.push(color);
		
		var cosSpectral = this.calcFragmentPartialSpecular(triangleIndex);
		this.fragmentColorsSpectralPartial.push(cosSpectral);
	}
	
	repeatedFragmentColors = [];
	this.convertToRepeatedFragmentNormals();
}



/*Calculate the color of each vertex of SOR for Gourand shading*/
SORobject.prototype.calcVertexNormals = function() {
	debugPrinting();
	
	var vertexNormals = [];

	// Initially set all vertiecs to 1
	for (var i = 0; i < this.vertices.length; i++) {
		vertexNormals.push([0, 0, 0]);
	}
	
	// Find the vertex normals 
	for (var triangleIndex = 0; triangleIndex < (this.indices.length - 3); triangleIndex += 3) {
		// Get the saved start and end point of the fragment's normal vector 
		var normal_unscaled_start = this.fragmentNormalVertices.slice(2*triangleIndex, (2*triangleIndex + 3));
		var normal_unscaled_end = this.fragmentNormalVertices.slice((2*triangleIndex + 3), (2*triangleIndex + 6));
		
		var fragNormal = vector_subtract(normal_unscaled_end, normal_unscaled_start);
		
		// Pt 1 on fragment
		for (var i = 0; i < 3; i++) {
			vertexNormals[this.indices[triangleIndex + i]] = vector_add(vertexNormals[this.indices[triangleIndex + i]], fragNormal);
		}
	}
	
	this.convertToRepeatedVertexNormals(vertexNormals);
}


/* Draw red lines bewtween the pairs of points specified in fragmentNormalIndices 
array and saved in fragmentNormalVertices array */
SORobject.prototype.drawNormals = function() {
	debugPrinting();
	
	var fragmentNormalVerticesNew = new Float32Array(this.fragmentNormalVertices);
	var fragmentNormalIndicesNew = new Uint16Array(this.fragmentNormalIndices);
	
	
	// Create a new buffer for normals
	var normalsVertexBuffer = glContext.createBuffer();
	var normalsIndexBuffer = glContext.createBuffer();
	if ((!normalsVertexBuffer) || (!normalsIndexBuffer)) {
		console.log("Error creating buffers to draw normals!");
		return -1
	}
	glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, normalsIndexBuffer);
	glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, fragmentNormalIndicesNew, glContext.STATIC_DRAW);
	
	setAttribute('a_Position', this.fragmentNormalVertices, 3);	
	
	// Change the drawing color to red
	var color = [1.0, 0.0, 0.0];
	setSolidColor(glContext, color);
	
	setUniformBool('u_drawSolidColor', true);
	// Now superimpose the normals
	for (var triangleIndex = 0; triangleIndex < this.fragmentNormalIndices.length; triangleIndex += 2) {
		glContext.drawElements(glContext.LINE_STRIP, 2, glContext.UNSIGNED_SHORT, (triangleIndex*2));
	}
	setUniformBool('u_drawSolidColor', false);
	
}

// Draws the light 1 as a red line (actually draws narrow surface to make it easier to select)
function drawLight1(checkWhetherClicked) {
	debugPrinting();
	
	var lightVertices1;
	var lightIndices1;
	var color1;
	var checkWhetherClickedColor = [0.0, 0.0, 1.0];

	// Draw line as two vary narrow triangles
	var lineWidth = 7;
	lightVertices1 = [0.0, 0.0, 0.0, 	
					lightingPosition[0], lightingPosition[1], lightingPosition[2],		
					lineWidth, -lineWidth, 0.0,
					(lightingPosition[0] + lineWidth), (lightingPosition[1] - lineWidth), lightingPosition[2]];
	lightIndices1 = [0, 1, 2,
					1, 2, 3];	
	
	// If the light is being drawn to check whether selected point in on line, draw line in blue
	if (checkWhetherClicked) {
		color1 = [0.0, 0.0, 1.0];
	}
	else {		
		if (light1On) {
			color1 = [1.0, 0.0, 0.0];
		}
		else {
			color1 = [0.5, 0.5, 0.5];  // Light is gray if turned off
		}
	}

	drawLight(lightVertices1, lightIndices1, color1);
}



/*Sets the indices & vertices to draw light 2 and calls function to draw light */
function drawLight2(checkWhetherClicked) {
	debugPrinting();
	
	var checkWhetherClickedColor = [0.0, 0.0, 1.0];
	var color2;
	
	//Draw light 2:
	var center = light2Position;
	var halfSideDim = (50/2);
	
	// Draw cube centered at (0, 500, 0) that is 50 units in each dimension
	var lightVertices2 = 	[(center[0] + halfSideDim), (center[1] + halfSideDim), (center[2] + halfSideDim),
							(center[0] + halfSideDim), (center[1] + halfSideDim), (center[2] - halfSideDim),
							(center[0] - halfSideDim), (center[1] + halfSideDim), (center[2] - halfSideDim),
							(center[0] - halfSideDim), (center[1] + halfSideDim), (center[2] + halfSideDim),
							(center[0] + halfSideDim), (center[1] - halfSideDim), (center[2] + halfSideDim),
							(center[0] + halfSideDim), (center[1] - halfSideDim), (center[2] - halfSideDim),
							(center[0] - halfSideDim), (center[1] - halfSideDim), (center[2] - halfSideDim),
							(center[0] - halfSideDim), (center[1] - halfSideDim), (center[2] + halfSideDim)];
	var lightIndices2 = [0, 1, 2,	0, 2, 3,
						0, 5, 1,	0, 4, 5,
						1, 6, 2,	1, 5, 6,
						2, 7, 3,	2, 6, 7,
						3, 4, 0,	3, 7, 4,
						4, 6, 5,	4, 7, 6];
	
	// If the light is being drawn to check whether selected point in on line, draw line in blue
	if (checkWhetherClicked) {
		color2 = checkWhetherClickedColor;
	}
	else {
		if (light2On) {
			color2 = [1.0, 1.0, 0.0];
		}
		else {
			color2 = [0.5, 0.5, 0.5];  // Light is gray if turned off
		}
	}
	drawLight(lightVertices2, lightIndices2, color2);
}

// Function to draw the light respresentation
function drawLight(lightVertices, lightIndices, lightColor) {
	debugPrinting();
	
	setUniformBool("u_isObject", false);
	var lightIndicesNew = new Uint16Array(lightIndices);
	
	var lightVerticesBuffer = glContext.createBuffer();
	var lightIndicesBuffer = glContext.createBuffer();
	
	if (!lightVerticesBuffer || !lightIndicesBuffer) {
		console.log("Error creating buffers to draw light!");
		return -1		
	}
	
	glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, lightIndicesBuffer);
	glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, lightIndicesNew, glContext.STATIC_DRAW);
	
	setAttribute('a_Position', lightVertices, 3);

	setSolidColor(glContext, lightColor);
	setUniformBool('u_drawSolidColor', true);
	glContext.drawElements(glContext.TRIANGLES, lightIndices.length, glContext.UNSIGNED_SHORT, 0);
	setUniformBool('u_drawSolidColor', false);
}



function changeColor(newColorValue, colorIndex, matPropIndex) {
	debugPrinting();
	
	if (!currentSOR) {
		console.log("NO OBJECTS SELECTED!!!");
		return;
	}
	
	switch(matPropIndex) {
		case 0:
			currentSOR.kDiffuse[colorIndex] = newColorValue;
			break;
		case 1:
			currentSOR.kSpecular[colorIndex] = newColorValue;
			break;
		case 2:
			currentSOR.kAmbient[colorIndex] = newColorValue;
			break;
		default:
			console.log("Not a valid material property!");
			break;
	}
	drawAllSORs();
}





/* Rotate, translate, or scale the selected object*/
function transformSelectedObj(transformType, xChange, yChange, zChange) {
	debugPrinting();
	
	if (!currentSOR) {
		console.log("NO OBJECTS SELECTED!!!");
		return;
	}
	
	switch(transformType) {
		case "scale":
			currentSOR.scaling.scale(xChange, yChange, zChange);
			break;
		
		case "translate":
			currentSOR.translation.translate(xChange, yChange, zChange);
			break;
		case "rotate":
			if (xChange != 0) {
				currentSOR.rotation.rotate(xChange, 1, 0, 0);
				break;
			}
			if (zChange != 0) {
				currentSOR.rotation.rotate(zChange, 0, 0, 1);
				break;
			}	
		default:
			currentSOR.transformMatrix.setIdentity();
			break;
	}
	
	currentSOR.transformMatrix.setIdentity();
	
	var rotationTemp = new Matrix4(currentSOR.rotation);
	var scalingTemp = new Matrix4(currentSOR.scaling);
	var translationTemp = new Matrix4(currentSOR.translation);
	
	var redoOrigTranslation = new Matrix4(currentSOR.origTranslation);
	var undoOrigTranslation = new Matrix4;
	undoOrigTranslation.setInverseOf(currentSOR.origTranslation);
	
	currentSOR.transformMatrix.multiply(redoOrigTranslation.multiply(translationTemp.multiply(rotationTemp.multiply(scalingTemp.multiply(undoOrigTranslation)))));
	
	
	currentSOR.invTransformMatrix.setIdentity();
	
	var copyTranformation = new Matrix4(currentSOR.transformMatrix);
	var transposeTranformation = new Matrix4(copyTranformation.transpose());
	currentSOR.invTransformMatrix = new Matrix4(transposeTranformation.invert());
	
	currentSOR.setTransformMatrix();
	
	
	
}

/* Translate the center position */
SORobject.prototype.getTranslatedCenterPosition = function() {
	var centerPositionVector = new Vector4();
	var centerPositionVectorElements = centerPositionVector.elements;
	
	centerPositionVectorElements[0] = this.centerPosition[0];
	centerPositionVectorElements[1] = this.centerPosition[1];
	centerPositionVectorElements[2] = this.centerPosition[2];
	centerPositionVectorElements[3] = 1.0;
	
	
	var centerPositionVector = this.transformMatrix.multiplyVector4(centerPositionVector);
	var translatedCenterPos = [];
	
	translatedCenterPos.push(centerPositionVector.elements[0]);
	translatedCenterPos.push(centerPositionVector.elements[1]);
	translatedCenterPos.push(centerPositionVector.elements[2]);
	
	return translatedCenterPos;
}



/* Normalize the vector*/
function vector_norm(vector) {
	debugPrinting();
	
	return vector_mult(vector, (1/vector_mag(vector)));
}


function setUniformV3(uniformName, data) {
	debugPrinting();
	
	var uniformLocation = glContext.getUniformLocation(glContext.program, uniformName);
	if (uniformLocation < 0) { 
		console.log('Failed to get the storage location of u_SolidColor');
		return false;
	}
	// Pass color to uniform vector
	glContext.uniform3f(uniformLocation, data[0], data[1], data[2]);
}

/*Set color for flat shading*/
function setSolidColor(glContext, color) {
	debugPrinting();
	
	var u_SolidColor = glContext.getUniformLocation(glContext.program, 'u_SolidColor');
	if (u_SolidColor < 0) { 
		console.log('Failed to get the storage location of u_SolidColor');
		return false;
	}
	// Pass color to uniform vector
	glContext.uniform4f(u_SolidColor, color[0], color[1], color[2], 1.0);
}


function setAttribute(attributeName, dataArray, attributeSize) {
	debugPrinting();
	
	var dataArray32BitFloat = new Float32Array(dataArray);
	var attributeBuffer = glContext.createBuffer();
	if (!attributeBuffer) {
		console.log("Error creating buffer for " + attributeName);
		return false
	}
	glContext.bindBuffer(glContext.ARRAY_BUFFER, attributeBuffer);
	glContext.bufferData(glContext.ARRAY_BUFFER, dataArray32BitFloat, glContext.STATIC_DRAW);
	
	//Now pass same color as attirubtes to all relevant activeVertices	
	var attributeLocation = glContext.getAttribLocation(glContext.program, attributeName);
	if (attributeLocation < 0) {
		console.log("Failed to get storage location of " + attributeName);
	}
	
	var FSIZE = dataArray32BitFloat.BYTES_PER_ELEMENT;	
	glContext.vertexAttribPointer(attributeLocation, attributeSize, glContext.FLOAT, false, attributeSize*FSIZE, 0);
	glContext.enableVertexAttribArray(attributeLocation);
}

function setUniformFloat(uniformName, data) {
	debugPrinting();
	var uniformLocation = glContext.getUniformLocation(glContext.program, uniformName);
	
	if (uniformLocation < 0) {
		console.log('Failed to get the storage location of ' + uniformName);
		return false;		
	}
	
	glContext.uniform1f(uniformLocation, data);
}


SORobject.prototype.setTransformMatrix = function() {
	debugPrinting();
	
	
	var u_transformMatrix = glContext.getUniformLocation(glContext.program, 'u_transformMatrix');
	if (!u_transformMatrix) { 
		console.log('Failed to get the storage location of u_transformMatrix');
		return;
	}
	glContext.uniformMatrix4fv(u_transformMatrix, false, this.transformMatrix.elements);
	
	var u_invTransformMatrix = glContext.getUniformLocation(glContext.program, 'u_invTransformMatrix');
	if (!u_transformMatrix) { 
		console.log('Failed to get the storage location of u_invTransformMatrix');
		return;
	}
	glContext.uniformMatrix4fv(u_invTransformMatrix, false, this.invTransformMatrix.elements);
}

/*Set the view to orthogonal*/
function setViewPosition( drawingMode ) {
	debugPrinting();
	
	viewingDir = [eyeX, eyeY, eyeZ];
	setUniformV3('u_viewingDir', viewingDir);	
	
	var u_ViewMatrix = glContext.getUniformLocation(glContext.program, 'u_ViewMatrix');
	if (!u_ViewMatrix) { 
		console.log('Failed to get the storage location of u_ViewMatrix');
		return;
	}
	
	// Set the eye point and the viewing volume
	var viewMatrix = new Matrix4();
	if (drawingMode == DRAWSCENE) {
		viewMatrix.setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, 0.0, canvasScale*1.0, 0.0);
	}
	else {
		// If drawing SOR
		viewMatrix.setLookAt(0.0, 0.0, 2*canvasScale, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
	}
	glContext.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	
	var u_ProjMatrix = glContext.getUniformLocation(glContext.program, 'u_ProjMatrix');
	if (!u_ProjMatrix) { 
		console.log('Failed to get the storage location of u_ProjMatrix');
		return;
	}
	
	var projMatrix = new Matrix4();
	
	
	// Pass the model view projection matrix to u_MvpMatrix
	if ((view == PERSPECTIVE) && (drawingMode == DRAWSCENE)) {
		projMatrix.setPerspective(fovy, 1, 0.01, 10.0*canvasScale);	
	}
	else {  // view = ORTHO
		projMatrix.setOrtho(-1.0*canvasScale, 1.0*canvasScale, -1.0*canvasScale, 1.0*canvasScale, -2.0*canvasScale, 10.0*canvasScale);

	}
	glContext.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
}


/* When user has a file selected and clicks 'update screen', the selected SOR is loaded into into the vertices and indices arrays, and is then rendered vis the drawSOR function*/
function updateScreen(glContext, lab1canvas, a_Position) {
	debugPrinting();
	
	var readSORObject = readFile();
	var loadedSORobject = new SORobject;
	
	// Only try to render if an object was sucessfully loaded
	if (readSORObject) {
		loadedSORobject.vertices = readSORObject.vertices;
		loadedSORobject.indices = readSORObject.indexes;

		loadedSORobject.calcFragmentNormals();
		loadedSORobject.calcVertexNormals();
		loadedSORobject.calcTextureCoords();
		loadedSORobject.calcOrigTranslation();
		
		var normalCheckbox = document.getElementById("normalsCheckbox");
		if (normalCheckbox) {
			normalCheckbox.clicked = false;
		}
		loadedSORobject.convertToRepeatedVertices();
		allObjects.push(loadedSORobject);
		currentSOR = loadedSORobject;
		
		drawAllSORs(false);
	}
}


/* Calculate the magnitude of a vector */
function vector_mag(vector) {
	debugPrinting();
	
	var sum_of_sqrs = 0.0;	// radicand
	var magnitude; 
	
	// Radicand is the sum of all elements in vector squared
	for (var i = 0; i < vector.length; i++) {
		sum_of_sqrs += Math.pow((vector[i]), 2);
	} 
	var magnitude = Math.sqrt(sum_of_sqrs);
	return magnitude;
}



/* Calculate the dot product of vector1 dot vector2 */
function vector_dot_prod(vector1, vector2) {
	debugPrinting();
	
	var dot_product = 0;
	if (vector1.length != vector2.length) {
		console.log("Error: Vectors are not same length! Vector 1 is " + (vector1.length).toString() 
		+ " Vector 2 is " + (vector2.length).toString());
		return 0;
	}
	
	// Multiply ith element of vector1 by ith element of vector2, and add to the running sum of squares
	for (var i = 0; i < vector1.length; i++) {
		dot_product += vector1[i]*vector2[i];
	}
	return dot_product;
}

/* Multiply vector by scalar */
function vector_mult(vector, scalar) {
	debugPrinting();
	
	return [(scalar*vector[0]), (scalar*vector[1]), (scalar*vector[2])];
}

/* Calculate the difference (vector1 - vector2) */
function vector_subtract(vector1, vector2) {
	debugPrinting();
	
	var difference = [];
	
	// Check that vectors are at same length
	if (vector1.length != vector2.length) {
		console.log("Error: Vectors are not same length! Vector 1 is " + (vector1.length).toString() 
		+ " Vector 2 is " + (vector2.length).toString());
		return 0;
	}
	
	//Subtract ith element of vector2 of a from corresponding element in vector 1 to get ith element of the difference
	for (var i = 0; i < vector1.length; i++) {
		difference.push(vector1[i] - vector2[i]);
	}
	return difference;
}

/*Calculate the sum of vector1 and vector2 */
function vector_add(vector1, vector2) {
	debugPrinting();
	
	var sum = [];
	
	// Check that vectors are at same length
	if (vector1.length != vector2.length) {
		console.log("Error: Vectors are not same length! Vector 1 is " + (vector1.length).toString() 
		+ " Vector 2 is " + (vector2.length).toString());
		return 0;
	}
	
	//Subtract ith element of vector2 of a from corresponding element in vector 1 to get ith element of the difference
	for (var i = 0; i < vector1.length; i++) {
		sum.push(vector1[i] + vector2[i]);
	}
	return sum;
}

function printVector(vector) {
	console.log("[" + vector[0] + "," + vector[1] + ", " + vector[2] + "]");
}

function printMTX4(matrix)  {
	debugPrinting();
	
	var array = matrix.elements;
	console.log("[" + array[0] + "," + array[4] + ", " + array[8] + ", " + array[12] + "]");
	console.log("[" + array[1] + "," + array[5] + ", " + array[9] + ", " + array[13] + "]");
	console.log("[" + array[2] + "," + array[6] + ", " + array[10] + ", " + array[14] + "]");
	console.log("[" + array[3] + "," + array[7] + ", " + array[11] + ", " + array[15] + "]");
}

function debugPrinting() {
	if (debugMode) {
		console.log("Called " + arguments.callee.caller.name);
	}
}


SORobject.prototype.initTextures = function() {
	debugPrinting();
	
	this.texture = glContext.createTexture();   // Create a texture object
	if (!this.texture) {
	console.log('Failed to create the texture object');
		return null;
	}

	this.image = new Image();  // Create a image object
	if (!this.image) {
	console.log('Failed to create the image object');
		return null;
	}
	this.image.src = this.textureImagePath;


	var self = this;
	
	// Register the event handler to be called when image loading is completed
	this.image.onload = function() { drawAllSORs(); };
}

SORobject.prototype.setTextureBuffer = function() {
	glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
    glContext.activeTexture(glContext.TEXTURE0);
    glContext.bindTexture(glContext.TEXTURE_2D, this.texture);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
    glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, this.image);

    // Pass the texure unit 0 to u_Sampler
	var sampler = glContext.getUniformLocation(glContext.program, 'u_Sampler');
	glContext.uniform1i(sampler, 0);
}


	
