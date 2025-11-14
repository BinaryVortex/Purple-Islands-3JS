class SecondGrid {
    constructor(opt) {
        this.geometry = new THREE.InstancedBufferGeometry()
        this.scene = opt.scene;
        this.coords = opt.coords;
        this.count = opt.count
        this.screenRatio = opt.screenRatio;

        this.createBlueprint()
        this.instanceBlueprint()
    }

    createBlueprint() {
        this.blueprint = this.coords;

        this.sideLength = Math.sqrt((Math.pow(this.blueprint[0]-this.blueprint[3],2))+(Math.pow(this.blueprint[1]-this.blueprint[4],2)))
        this.uv = [0,0.5,0.5,0.14,0.5,0.86,0.5,0.14,1,0.5,0.5,0.86]
        console.log(this.coords)

        let position =  new THREE.BufferAttribute(new Float32Array(this.blueprint),3)
        this.geometry.addAttribute('position', position) 
        let uv =  new THREE.BufferAttribute(new Float32Array(this.uv),2)
        this.geometry.addAttribute('uv', uv)    

    }

    instanceBlueprint() {
        var translation = new Float32Array( this.count * 3 );
        
        var uvOffset = new Float32Array(this.count * 2);
        var uvScales = new Float32Array(this.count * 2);

        var uvOffsetIterator = 0;
        var uvScalesIterator = 0;
        //and iterators for convenience :)
        var translationIterator = 0;
        this.rank = -1;


        let uvScale = new THREE.Vector2(1 / 60, 1 / 60);

        for (let i = 0; i < 120; i++) {

            for (let j = 0; j < 60; j++) {
                this.rank++            
          
                uvScales[uvScalesIterator++] = uvScale.x;
                uvScales[uvScalesIterator++] = uvScale.y;
                if(i %2 ==0) {
                    translation[ translationIterator++ ] = 2*((Math.sin(Math.PI/3)*this.sideLength)*j)  - Math.abs(((this.screenRatio.x*2)-2*((Math.sin(Math.PI/3)*this.sideLength))*60))/2
                    translation[ translationIterator++ ] = i*this.sideLength/2  - this.sideLength*60 + Math.abs(((-this.screenRatio.y*2)-this.sideLength*60))/2
                    translation[ translationIterator++ ] = 0                
                    uvOffset[uvOffsetIterator++] =  j * uvScale.x;
                    uvOffset[uvOffsetIterator++] =  0.36*i * uvScale.y;
                } else {
                    translation[ translationIterator++ ] = 2*((Math.sin(Math.PI/3)*this.sideLength)*j)+(Math.sin(Math.PI/3)*this.sideLength) - Math.abs(((this.screenRatio.x*2)-2*((Math.sin(Math.PI/3)*this.sideLength))*60))/2
                    translation[ translationIterator++ ] = i*this.sideLength/2  - this.sideLength*60 + Math.abs(((-this.screenRatio.y*2)-this.sideLength*60))/2
                    translation[ translationIterator++ ] = 0    
                    uvOffset[uvOffsetIterator++] =  (j * uvScale.x)+(0.5/6) ;
                    uvOffset[uvOffsetIterator++] =  0.36*i * uvScale.y;      
                }
                
            }
            
            
        }
        this.geometry.addAttribute( 'translation', new THREE.InstancedBufferAttribute( translation, 3, 1 ) );
        
  this.geometry.addAttribute(
    "uvOffset",
    new THREE.InstancedBufferAttribute(uvOffset, 2, 1)
  );
  this.geometry.addAttribute(
    "uvScale",
    new THREE.InstancedBufferAttribute(uvScales, 2, 1)
  );    
        //   video = document.createElement( 'video' );
        // // video.id = 'video';
        // // video.type = ' video/ogg; codecs="theora, vorbis" ';
        // video.src = "../Untitled.mp4";
        // video.load(); // must call after setting/changing source
        // video.play();

        // var texture = new THREE.VideoTexture( video );
        // texture.minFilter = THREE.LinearFilter;
        // texture.magFilter = THREE.LinearFilter;
        // texture.format = THREE.RGBFormat;

        let material = new THREE.RawShaderMaterial(
            {    uniforms: {
                    u_time: {
                        type:'f',
                        value:1.0,
                    },
                    envmap: { type: "t", value: null },
                    texture: { type: "t", value: null },

                },

                vertexShader: document.getElementById('vertShader').innerHTML,
                fragmentShader: document.getElementById('fragShader').innerHTML,
                side: THREE.DoubleSide,
                wireframe: false,              
            }
        )
        
        var co = 'http://crossorigin.me/', 
		url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2017/leopard_stalking.jpg', 
		src = co + url;
        
        var tl = new THREE.TextureLoader();
        tl.setCrossOrigin( "Anonymous" );
        tl.load('data:image/jpeg;base64,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', function( t ) {
          material.uniforms.envmap.value = t;
        });

    

      

        this.grid = new THREE.Mesh(this.geometry, material)
        this.scene.add(this.grid)
    }
}

class createApp {
	constructor(opt) {
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		this.winRatio = this.winWidth/this.winHeight
		this.camera = new THREE.PerspectiveCamera( 50,this.winRatio, 0.005, 1000 )
		this.camera2 = new THREE.PerspectiveCamera( 50,this.winRatio, 0.005, 1000 )
		this.camera.setFocalLength(50)
		this.camera2.setFocalLength(50)
		this.camera.position.z = 1
		this.camera2.position.z = 0.015
        this.controls = new THREE.OrbitControls(this.camera2);
    this.controls.enableRotate = false;
		this.target = new THREE.Vector3()
		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true})
		this.renderer.setSize(this.winWidth, this.winHeight)

		document.body.appendChild(this.renderer.domElement)

		window.addEventListener('resize', this.onResize.bind(this))
		window.addEventListener('mousemove', this.onMouseMove.bind(this))

		this.rawCoords = [
			{
				x:this.winWidth/101,
				y:0,
			},

			{	
				x:Math.cos(2*Math.PI/3)*this.winWidth/101,
				y:Math.sin(2*Math.PI/3)*this.winWidth/101
			},
			{	
				x:Math.cos((2*Math.PI/3)*2)*this.winWidth/101,
				y:Math.sin((2*Math.PI/3)*2)*this.winWidth/101
			},
		]

		this.rawCoords2 = [
			{
				x:-this.winWidth/60,
				y:0,
			},


			{	
				x:-	Math.cos(-2*Math.PI/3)*this.winWidth/60,
				y:-	Math.sin(-2*Math.PI/3)*this.winWidth/60
			},
			{	
				x:-	Math.cos((-2*Math.PI/3)*2)*this.winWidth/60,
				y:-	Math.sin((-2*Math.PI/3)*2)*this.winWidth/60
			},


			{	
				x:-	Math.cos(-2*Math.PI/3)*this.winWidth/60,
				y:-	Math.sin(-2*Math.PI/3)*this.winWidth/60
			},
			{
				x:2*this.winWidth/60,
				y:0,
			},
			{	
				x:-	Math.cos((-2*Math.PI/3)*2)*this.winWidth/60,
				y:-	Math.sin((-2*Math.PI/3)*2)*this.winWidth/60
			},
		]

		// let geo = new THREE.PlaneGeometry(10,10,120,120);
		// let mat = new THREE.MeshBasicMaterial({color:"#ffffff",wireframe:true})

		// let meshh = new THREE.Mesh(geo, mat)
		// this.scene.add(meshh)
		// meshh.rotation.z = Math.PI/4
		

		this.treatedCoords = []
		
		this.light = new THREE.PointLight(0xffffff)
		this.light.position.set(0,0,0.6)
		this.scene.add(this.light)

		this.time = 0
		this.initCoords()
		this.animate()
		
	}

	initCoords() {
		for (let i = 0; i < this.rawCoords2.length; i++) {
			let treatedCoordsX = ((this.rawCoords2[i].x)/this.winWidth)*2-1
			let treatedCoordsY = -((this.rawCoords2[i].y)/this.winHeight)*2+1	
			
			this.newPos = new THREE.Vector3(treatedCoordsX, treatedCoordsY,-1).unproject(this.camera)
			this.treatedCoords.push(this.newPos.x, this.newPos.y, this.newPos.z)

		}
		this.grid2 = new SecondGrid({count:7200, scene: this.scene, coords: this.treatedCoords,  screenRatio: new THREE.Vector3(1, -1,-1).unproject(this.camera) })
		//this.grid = new Grid({count: 10201, scene: this.scene, coords:this.treatedCoords, screenRatio: new THREE.Vector3(1, -1,-1).unproject(this.camera)})

	}


	onMouseMove(e) {
		let mouseX = e.clientX
		let mouseY = e.clientY
		
		this.mouseX = ((mouseX)/this.winWidth)*2-1
		this.mouseY = -((mouseY)/this.winHeight)*2+1	
	
	}

	onResize() {
		this.winWidth = window.innerWidth
		this.winHeight = window.innerHeight
		this.winRatio = this.winWidth/this.winHeight
		this.camera2.aspect = this.winRatio;
		this.camera2.updateProjectionMatrix();	
		this.renderer.setSize(this.winWidth, this.winHeight)
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this))
		
		
		this.camera2.lookAt(this.target);
		this.time += 1
		// this.grid.grid.material.uniforms.u_time.value = this.time
		this.grid2.grid.material.uniforms.u_time.value = this.time
			
		// this.mousePos = new THREE.Vector3(this.mouseX, this.mouseY,-1).unproject(this.camera)
		// this.grid.grid.material.uniforms.u_mouse.value.x = this.mousePos.x
		// this.grid.grid.material.uniforms.u_mouse.value.y = this.mousePos.y
		

		//this.grid.grid.material.uniforms.u_time = this.time
		this.renderer.render(this.scene, this.camera2)
	}
}

new createApp()