function TDScene(drawClass) {
    this.dc = drawClass;
    this.centerX = this.dc.width/2;
    this.centerY = this.dc.height/2;
    
    this.tdlist;
    this.camera = {x: 0, y: 0, z: 0};
    
    this.cubes = [];
    this.XCubes = [];
    var top = this;
    
    this.init = function() {
        this.tdlist = [];
        var c1 = 0;
        var c2 = 0;
        var c3 = 0.65;
        for (var i = 0; i < 50000; i++) {
          //c1 = ((i*i*i*i)/1000000);
          this.tdlist.push(c1);
          c1 += c2;
          c2 += c3;
        }
    }
    
    this.add = function(cube) {
        cube.dir -= 45;
        if (!(typeof cube.img != 'undefined'))
            cube.img = "https://aaserver.net/images/ship2.png";
        if (cube.type == "x")
            this.XCubes.push({x: cube.x, y: cube.y, z: cube.z, width: cube.width, height: cube.height, lengthN: cube.lengthN, color: cube.color, dir: cube.dir, twod: cube.twod, sel: cube.sel, id: cube.id, img: cubue.img});
        else
            this.cubes.push({x: cube.x, y: cube.y, z: cube.z, width: cube.width, height: cube.height, lengthN: cube.lengthN, color: cube.color, dir: cube.dir, twod: cube.twod, sel: cube.sel, id: cube.id, img: cube.img});
    }
    
    this.rotCube = function(x, y, z, width, height, length, color, dir, twod, sel) {
        if (!(typeof twod != 'undefined'))
            twod = false;
        if (!(typeof sel != 'undefined'))
            sel = false;
        if (!(typeof dir != 'undefined'))
            dir = 0;
        dir-=45;
        this.cubes.push({x: x, y: y, z: z, width: width, height: height, lengthN: length, color: color, dir: dir, twod: twod, sel: sel});
    }
    
    this.rotCubeY = function(x, y, z, width, height, length, color, dir, twod, sel) {
        if (!(typeof twod != 'undefined'))
            twod = false;
        if (!(typeof sel != 'undefined'))
            sel = false;
        dir-=45;
        this.cubes.push({x: x, y: y, z: z, width: width, height: height, lengthN: length, color: color, dir: dir, twod: twod, sel: sel});
    }
    
    this.rotCubeX = function(x, y, z, width, height, length, color, dir, twod, sel) {
        if (!(typeof twod != 'undefined'))
            twod = false;
        if (!(typeof sel != 'undefined'))
            sel = false;
        dir-=45;
        this.XCubes.push({x: x, y: y, z: z, width: width, height: height, lengthN: length, color: color, dir: dir, twod: twod, sel: sel});
    }
    
    this.sort_by = function(field, reverse, primer){

       var key = primer ? 
           function(x) {return primer(x[field])} : 
           function(x) {return x[field]};
    
       reverse = !reverse ? 1 : -1;
    
       return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
         } 
    }
    this.dynamicSort = function(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    
    this.draw = function() {
        //this.cubes.sort(this.dynamicSort('-z'));
        for (var i = 0; i < top.cubes.length; i++) {
            var strokeSize = 2;
            var x = top.cubes[i].x;
            var y = top.cubes[i].y;
            var z = top.cubes[i].z;
            var width = top.cubes[i].width;
            var height = top.cubes[i].height;
            var length = top.cubes[i].lengthN;
            var color = top.cubes[i].color;
            var dir = top.cubes[i].dir;
            var twod = top.cubes[i].twod;
            var sel = top.cubes[i].sel;
            var img = top.cubes[i].img;
            
          var a = {x: x, z: z};
          a.x += Math.cos((0+dir) * Math.PI / 180)/2*width;
          a.z += Math.sin((0+dir) * Math.PI / 180)*10*length;
          
          var b = {x: x, z: z};
          b.x += Math.cos((90+dir) * Math.PI / 180)/2*width;
          b.z += Math.sin((90+dir) * Math.PI / 180)*10*length;
          
          var ct = {x: x, z: z};
          ct.x += Math.cos((180+dir) * Math.PI / 180)/2*width;
          ct.z += Math.sin((180+dir) * Math.PI / 180)*10*length;
          
          var d = {x: x, z: z};
          d.x += Math.cos((-90+dir) * Math.PI / 180)/2*width;
          d.z += Math.sin((-90+dir) * Math.PI / 180)*10*length;
          
          a.z = Math.ceil(a.z)
          b.z = Math.ceil(b.z)
          ct.z = Math.ceil(ct.z)
          d.z = Math.ceil(d.z)
          
          var e = this.point(a.x+this.camera.x, y+this.camera.y, a.z+this.camera.z);
          var f = this.point(b.x+this.camera.x, y+this.camera.y, b.z+this.camera.z);
          var g = this.point(ct.x+this.camera.x, y+this.camera.y, ct.z+this.camera.z);
          var h = this.point(d.x+this.camera.x, y+this.camera.y, d.z+this.camera.z);
          
          var it = {x: x, z: z};
          it.x += Math.cos((0+dir) * Math.PI / 180)/2*width;
          it.z += Math.sin((0+dir) * Math.PI / 180)*10*length;
          
          var j = {x: x, z: z};
          j.x += Math.cos((90+dir) * Math.PI / 180)/2*width;
          j.z += Math.sin((90+dir) * Math.PI / 180)*10*length;
          
          var k = {x: x, z: z};
          k.x += Math.cos((180+dir) * Math.PI / 180)/2*width;
          k.z += Math.sin((180+dir) * Math.PI / 180)*10*length;
          
          var l = {x: x, z: z};
          l.x += Math.cos((-90+dir) * Math.PI / 180)/2*width;
          l.z += Math.sin((-90+dir) * Math.PI / 180)*10*length;
          
          var m = this.point(it.x+this.camera.x, y+this.camera.y-height/2, Math.ceil(it.z+this.camera.z));
          var n = this.point(j.x+this.camera.x, y+this.camera.y-height/2, Math.ceil(j.z+this.camera.z));
          var o = this.point(k.x+this.camera.x, y+this.camera.y-height/2, Math.ceil(k.z+this.camera.z));
          var p = this.point(l.x+this.camera.x, y+this.camera.y-height/2, Math.ceil(l.z+this.camera.z));
          
          if (twod) {
          this.dc.ctx.beginPath();
          this.dc.ctx.fillStyle = color;
          this.dc.ctx.moveTo(f.x, f.y);
          this.dc.ctx.lineTo(g.x, g.y);
          this.dc.ctx.lineTo(o.x, o.y);
          this.dc.ctx.lineTo(n.x, n.y);
          this.dc.ctx.lineTo(f.x, f.y);
          this.dc.ctx.fill();   
          }
          else {
              if (dir+45 >= -90 && dir+45 <= 90) {
                  
                  this.dc.ctx.beginPath();
                  this.dc.ctx.fillStyle = color;
                  this.dc.ctx.moveTo(f.x, f.y);
                  this.dc.ctx.lineTo(g.x, g.y);
                  this.dc.ctx.lineTo(o.x, o.y);
                  this.dc.ctx.lineTo(n.x, n.y);
                  this.dc.ctx.lineTo(f.x, f.y);
                  this.dc.ctx.fill();
                  
                  /*var blueprint_background = new Image(100, 100);
                  blueprint_background.src = img; 
                  blueprint_background.x = this.point(x, y, z).x;
                  blueprint_background.y = this.point(x, y, z).y;
                  var pattern = this.dc.ctx.createPattern(blueprint_background, "repeat");
                
                  this.dc.ctx.beginPath();
                  this.dc.ctx.fillStyle = pattern;
                  this.dc.ctx.moveTo(f.x, f.y);
                  this.dc.ctx.lineTo(g.x, g.y);
                  this.dc.ctx.lineTo(o.x, o.y);
                  this.dc.ctx.lineTo(n.x, n.y);
                  this.dc.ctx.lineTo(f.x, f.y);
                  this.dc.ctx.fill();*/
              }
            
              if (dir+45 >= 90 && dir+45 <= 270) {
                 this.dc.ctx.beginPath();
                 this.dc.ctx.fillStyle = color;
                 this.dc.ctx.moveTo(e.x, e.y);
                 this.dc.ctx.lineTo(h.x, h.y);
                 this.dc.ctx.lineTo(p.x, p.y);
                 this.dc.ctx.lineTo(m.x, m.y);
                 this.dc.ctx.lineTo(e.x, e.y);
                 this.dc.ctx.fill();
              }
              
              if (dir+45 >= 0 && dir+45 <= 180) {
                 this.dc.ctx.beginPath();
                 this.dc.ctx.fillStyle = color;
                 this.dc.ctx.moveTo(e.x, e.y);
                 this.dc.ctx.lineTo(f.x, f.y);
                 this.dc.ctx.lineTo(n.x, n.y);
                 this.dc.ctx.lineTo(m.x, m.y);
                 this.dc.ctx.lineTo(e.x, e.y);
                 this.dc.ctx.fill();
              }
              
              if ((dir+45 >= 180 && dir+45 <= 270) || (dir+45 >= -90 && dir+45 <= 0)) {
                 this.dc.ctx.beginPath();
                 this.dc.ctx.fillStyle = color;
                 this.dc.ctx.moveTo(h.x, h.y);
                 this.dc.ctx.lineTo(g.x, g.y);
                 this.dc.ctx.lineTo(o.x, o.y);
                 this.dc.ctx.lineTo(p.x, p.y);
                 this.dc.ctx.lineTo(h.x, h.y);
                 this.dc.ctx.fill();
              }
              
              this.dc.ctx.beginPath();
              this.dc.ctx.moveTo(m.x, m.y);
              this.dc.ctx.lineTo(n.x, n.y);
              this.dc.ctx.lineTo(o.x, o.y);
              this.dc.ctx.lineTo(p.x, p.y);
              this.dc.ctx.fill();
              
              this.dc.ctx.beginPath();
              this.dc.ctx.moveTo(e.x, e.y);
              this.dc.ctx.lineTo(f.x, f.y);
              this.dc.ctx.lineTo(g.x, g.y);
              this.dc.ctx.lineTo(h.x, h.y);
              this.dc.ctx.fill();
          }
          
          if (sel) {
              color = "yellow";
            this.dc.line(e.x, e.y, f.x, f.y, strokeSize, color);
            this.dc.line(f.x, f.y, g.x, g.y, strokeSize, color);
            this.dc.line(g.x, g.y, h.x, h.y, strokeSize, color);
            this.dc.line(h.x, h.y, e.x, e.y, strokeSize, color);
        
            this.dc.line(m.x, m.y, n.x, n.y, strokeSize, color);
            this.dc.line(n.x, n.y, o.x, o.y, strokeSize, color);
            this.dc.line(o.x, o.y, p.x, p.y, strokeSize, color);
            this.dc.line(p.x, p.y, m.x, m.y, strokeSize, color);
          
              this.dc.line(e.x, e.y, m.x, m.y, strokeSize, color);
              this.dc.line(f.x, f.y, n.x, n.y, strokeSize, color);
              this.dc.line(g.x, g.y, o.x, o.y, strokeSize, color);
              this.dc.line(h.x, h.y, p.x, p.y, strokeSize, color);
          }
        }
        //this.XCubes.sort(this.dynamicSort('-z'));
        for (var i = 0; i < top.XCubes.length; i++) {
        //for (var i = top.XCubes.length-1; i >= 0; i--) {
            var strokeSize = 2;
            var x = top.XCubes[i].x;
            var y = top.XCubes[i].y;
            var z = top.XCubes[i].z;
            var width = top.XCubes[i].width;
            var height = top.XCubes[i].height;
            var length = top.XCubes[i].lengthN;
            var color = top.XCubes[i].color;
            var dir = top.XCubes[i].dir;
            var twod = top.XCubes[i].twod;
            var sel = top.XCubes[i].sel;
            
          var a = {z: z, y: y};
          a.y += Math.cos((0+dir) * Math.PI / 180)/2*width;
          a.z += Math.sin((0+dir) * Math.PI / 180)*10*length;
          
          var b = {z: z, y: y};
          b.y += Math.cos((90+dir) * Math.PI / 180)/2*width;
          b.z += Math.sin((90+dir) * Math.PI / 180)*10*length;
          
          var c = {z: z, y: y};
          c.y += Math.cos((180+dir) * Math.PI / 180)/2*width;
          c.z += Math.sin((180+dir) * Math.PI / 180)*10*length;
          
          var d = {z: z, y: y};
          d.y += Math.cos((270+dir) * Math.PI / 180)/2*width;
          d.z += Math.sin((270+dir) * Math.PI / 180)*10*length;
          
          var e = this.point(x-height/2+this.camera.x, a.y+this.camera.y, Math.ceil(a.z)+this.camera.z);
          var f = this.point(x-height/2+this.camera.x, b.y+this.camera.y, Math.ceil(b.z)+this.camera.z);
          var g = this.point(x-height/2+this.camera.x, c.y+this.camera.y, Math.ceil(c.z)+this.camera.z);
          var h = this.point(x-height/2+this.camera.x, d.y+this.camera.y, Math.ceil(d.z)+this.camera.z);
          
          var it = this.point(x+height/2+this.camera.x, a.y+this.camera.y, Math.ceil(a.z)+this.camera.z);
          var j = this.point(x+height/2+this.camera.x, b.y+this.camera.y, Math.ceil(b.z)+this.camera.z);
          var k = this.point(x+height/2+this.camera.x, c.y+this.camera.y, Math.ceil(c.z)+this.camera.z);
          var l = this.point(x+height/2+this.camera.x, d.y+this.camera.y, Math.ceil(d.z)+this.camera.z);
          
          this.dc.circle(e.x, e.y, 2, "blue");
          this.dc.circle(f.x, f.y, 2, "red");
          this.dc.circle(g.x, g.y, 2, "red");
          this.dc.circle(h.x, h.y, 2, "red");
          this.dc.circle(it.x, it.y, 2, "red");
          this.dc.circle(j.x, j.y, 2, "red");
          this.dc.circle(k.x, k.y, 2, "red");
          this.dc.circle(l.x, l.y, 2, "red");
          
          //Right
          this.dc.ctx.beginPath();
          this.dc.ctx.fillStyle = color;
          this.dc.ctx.moveTo(it.x, it.y);
          this.dc.ctx.lineTo(j.x, j.y);
          this.dc.ctx.lineTo(k.x, k.y);
          this.dc.ctx.lineTo(l.x, l.y);
          this.dc.ctx.fill();
          this.dc.ctx.beginPath();
          this.dc.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
          this.dc.ctx.moveTo(it.x, it.y);
          this.dc.ctx.lineTo(j.x, j.y);
          this.dc.ctx.lineTo(k.x, k.y);
          this.dc.ctx.lineTo(l.x, l.y);
          this.dc.ctx.fill();
          
          //Top
          this.dc.ctx.beginPath();
          this.dc.ctx.fillStyle = color;
          this.dc.ctx.moveTo(g.x, g.y);
          this.dc.ctx.lineTo(h.x, h.y);
          this.dc.ctx.lineTo(l.x, l.y);
          this.dc.ctx.lineTo(k.x, k.y);
          this.dc.ctx.fill();
          
          //Near camera
          this.dc.ctx.beginPath();
          this.dc.ctx.fillStyle = color;
          this.dc.ctx.moveTo(e.x, e.y);
          this.dc.ctx.lineTo(h.x, h.y);
          this.dc.ctx.lineTo(l.x, l.y);
          this.dc.ctx.lineTo(it.x, it.y);
          this.dc.ctx.fill();
          this.dc.ctx.beginPath();
          this.dc.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          this.dc.ctx.moveTo(e.x, e.y);
          this.dc.ctx.lineTo(h.x, h.y);
          this.dc.ctx.lineTo(l.x, l.y);
          this.dc.ctx.lineTo(it.x, it.y);
          this.dc.ctx.fill();
        }
    }
    
    this.cube = function(x, y, z, twidth, theight, tlength, color) {
      var a = this.point(x+this.camera.x, y+this.camera.y, z+this.camera.z);
      var b = this.point(x+twidth+this.camera.x, y+this.camera.y, z+this.camera.z);
      var ct = this.point(x+twidth+this.camera.x, y+this.camera.y, z+theight+this.camera.z);
      var d = this.point(x+this.camera.x, y+this.camera.y, z+theight+this.camera.z);
      
      var e = this.point(x+this.camera.x, y+tlength+this.camera.y, z+this.camera.z);
      var f = this.point(x+twidth+this.camera.x, y+tlength+this.camera.y, z+this.camera.z);
      var g = this.point(x+twidth+this.camera.x, y+tlength+this.camera.y, z+theight+this.camera.z);
      var h = this.point(x+this.camera.x, y+tlength+this.camera.y, z+theight+this.camera.z); 
      
      this.dc.ctx.fillStyle = color;
      this.dc.ctx.strokeStyle = color;
      this.dc.ctx.lineWidth = 2;
      
      //Top
      this.dc.ctx.beginPath();
      this.dc.ctx.moveTo(a.x, a.y);
      this.dc.ctx.lineTo(b.x, b.y);
      this.dc.ctx.lineTo(ct.x, ct.y);
      this.dc.ctx.lineTo(d.x, d.y);
      this.dc.ctx.lineTo(a.x, a.y);
      this.dc.ctx.fill();
      
      /*c.ctx.beginPath();
      c.ctx.moveTo(e.x, e.y);
      c.ctx.lineTo(f.x, f.y);
      c.ctx.lineTo(g.x, g.y);
      c.ctx.lineTo(h.x, h.y);
      c.ctx.lineTo(e.x, e.y);
      c.ctx.stroke();*/
      
      //Right
      if (x+this.camera.x < 0) {
        this.dc.ctx.fillStyle = color;
        this.dc.ctx.beginPath();
        this.dc.ctx.moveTo(ct.x, ct.y);
        this.dc.ctx.lineTo(b.x, b.y);
        this.dc.ctx.lineTo(f.x, f.y);
        this.dc.ctx.lineTo(g.x, g.y);
        this.dc.ctx.lineTo(ct.x, ct.y);
        this.dc.ctx.fill();
        //Shadow
        this.dc.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        this.dc.ctx.beginPath();
        this.dc.ctx.moveTo(ct.x, ct.y);
        this.dc.ctx.lineTo(b.x, b.y);
        this.dc.ctx.lineTo(f.x, f.y);
        this.dc.ctx.lineTo(g.x, g.y);
        this.dc.ctx.lineTo(ct.x, ct.y);
        this.dc.ctx.fill();
        this.dc.ctx.fillStyle = color;
      }
      else {
        this.dc.ctx.fillStyle = color;
        this.dc.ctx.beginPath();
        this.dc.ctx.moveTo(a.x, a.y);
        this.dc.ctx.lineTo(d.x, d.y);
        this.dc.ctx.lineTo(h.x, h.y);
        this.dc.ctx.lineTo(e.x, e.y);
        this.dc.ctx.lineTo(a.x, a.y);
        this.dc.ctx.fill();
        
        this.dc.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        this.dc.ctx.beginPath();
        this.dc.ctx.moveTo(a.x, a.y);
        this.dc.ctx.lineTo(d.x, d.y);
        this.dc.ctx.lineTo(h.x, h.y);
        this.dc.ctx.lineTo(e.x, e.y);
        this.dc.ctx.lineTo(a.x, a.y);
        this.dc.ctx.fill();
      }
      
      //Near camera
      this.dc.ctx.fillStyle = color;
      this.dc.ctx.beginPath();
      this.dc.ctx.moveTo(d.x, d.y);
      this.dc.ctx.lineTo(ct.x, ct.y);
      this.dc.ctx.lineTo(g.x, g.y);
      this.dc.ctx.lineTo(h.x, h.y);
      this.dc.ctx.lineTo(d.x, d.y);
      this.dc.ctx.fill();
      //Shadow
      this.dc.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      this.dc.ctx.beginPath();
      this.dc.ctx.moveTo(d.x, d.y);
      this.dc.ctx.lineTo(ct.x, ct.y);
      this.dc.ctx.lineTo(g.x, g.y);
      this.dc.ctx.lineTo(h.x, h.y);
      this.dc.ctx.lineTo(d.x, d.y);
      this.dc.ctx.fill();
    }
    
    this.point = function(x, y, zf) {
        zf = map(zf, 0, 300, 300, 0);
        var z = this.tdlist[zf];
        //var z = zf*90;
        //z = 1000/(1000+zf);
        //return {x: x*z+this.centerX, y: y*z+this.centerY};
        
        return {x: x*(map(z, 0, 100, 0, 100)/100)+this.centerX, y: y*(map(z, 0, 100, 0, 100)/100)+this.centerY};
    }
}

function Cube(tdscene, x, y, z, size, color, dir, twod, sel, type, img) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = size;
    this.height = size;
    this.lengthN = size;
    this.color = color;
    this.dir = dir;
    this.twod = twod;
    this.sel = sel;
    this.id = tdscene.dc.random(1000000, 1000000000000);
    this.type = type;
    this.img = img;
}

function Cube2(tdscene, x, y, z, width, height, lengthN, color, dir, twod, sel, img) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.lengthN = lengthN;
    this.color = color;
    this.dir = dir;
    this.twod = twod;
    this.sel = sel;
    this.id = tdscene.dc.random(1000000, 1000000000000);
    this.img = img;
}

function map( x,  in_min,  in_max,  out_min,  out_max){
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}