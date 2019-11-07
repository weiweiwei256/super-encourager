function GameCanvas(canvas) {
    this.canvas = canvas;
    this.c = document.getElementById(this.canvas);
    this.ctx = this.c.getContext('2d');
    var top = this;
    this.tick = 0;

    this.mouse = {
        x: 0,
        y: 0,
        click: false
    };
    this.lockScroll = false;

    this.pictures = [1000];
    this.keys = [1000];
    this.width = document.getElementById(this.canvas).width;
    this.height = document.getElementById(this.canvas).height;

    this.lastLoop = new Date();
    this.fps = 0;
    this.slowFPS = 0;
    var time;
    this.fpsScaler = 1;
    
    this.textModeValue = "";

    document.addEventListener("keydown", function(e) {
        top.keys[e.keyCode] = true;
    });

    document.addEventListener("keyup", function(e) {
        top.keys[e.keyCode] = false;
    });

    document.addEventListener("touchstart", function(e) {
        top.mouse.x = e.touches[0].pageX;
        top.mouse.y = e.touches[0].pageY;
        top.mouse.click = true;
    });

    document.addEventListener("touchmove", function(e) {
        top.mouse.x = e.touches[0].pageX - top.c.getBoundingClientRect().left;
        top.mouse.y = e.touches[0].pageY - top.c.getBoundingClientRect().top;
    });

    document.addEventListener("touchend", function(e) {
        top.mouse.click = false;
    });

    document.ontouchmove = function(event) {
        if (top.lockScroll) {
            event.preventDefault();
        }
    }

    this.updateFPS = function() {
        var thisLoop = new Date;
        top.fps = 1000 / (thisLoop - top.lastLoop);
        if (top.tick % 10 == 0)
            top.slowFPS = top.fps;
        top.lastLoop = thisLoop;

        top.tick++;

        var now = new Date().getTime();
        top.fpsScaler = now - (time || now);

        time = now;

        top.fpsScaler /= 15;
    }

    this.c.addEventListener("mousemove", function(e) {
        top.mouse.x = e.clientX - top.c.getBoundingClientRect().left;
        top.mouse.y = e.clientY - top.c.getBoundingClientRect().top;
    });
    this.c.addEventListener("mousedown", function(e) {
        top.mouse.click = true;
    });
    this.c.addEventListener("mouseup", function(e) {
        top.mouse.click = false;
    });

    this.gradient = function(x, y, x2, y2, colors) {
        var a = 1 / (colors.length - 1);
        var b = 0;
        var grd = top.ctx.createLinearGradient(x, y, x2, y2);
        for (var i = 0; i < colors.length; ++i) {
            grd.addColorStop(b, colors[i]);
            b += a;
        }
        return grd;
    }

    this.map = function(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    this.setsize = function(width, height) {
        document.getElementById(this.canvas).height = height;
        document.getElementById(this.canvas).width = width;
        this.width = document.getElementById(this.canvas).width;
        this.height = document.getElementById(this.canvas).height;
    }
    this.setSize = function(width, height) {
        document.getElementById(this.canvas).height = height;
        document.getElementById(this.canvas).width = width;
        this.width = document.getElementById(this.canvas).width;
        this.height = document.getElementById(this.canvas).height;
    }

    this.hideScrollBar = function() {
        document.body.style.overflow = 'hidden';
    }
    this.showScrollBar = function() {
        document.body.style.overflow = 'visible';
    }

    this.background = function(color) {
        top.rect(0, 0, this.width, this.height, color);
    }

    this.newButton = function(x, y, width, height, backColor, strokeColor, strokeWidth, text, click) {
        if (top.mouse.x > x && top.mouse.x < x + width && top.mouse.y > y && top.mouse.y < y + height && top.mouse.click) {
            click();
            top.ctx.beginPath();
            top.ctx.fillStyle = strokeColor;
            top.ctx.strokeStyle = backColor;
            top.ctx.lineWidth = strokeWidth;
            top.ctx.fillRect(x, y, width, height);
            top.ctx.strokeRect(x, y, width, height);
            top.ctx.textAlign = "center";
            top.text(x + width / 2, y + height / 2, 20, text, "black");
            top.ctx.textAlign = "left";
        } else {
            top.ctx.beginPath();
            top.ctx.fillStyle = backColor;
            top.ctx.strokeStyle = strokeColor;
            top.ctx.lineWidth = strokeWidth;
            top.ctx.fillRect(x, y, width, height);
            top.ctx.strokeRect(x, y, width, height);
            top.ctx.textAlign = "center";
            top.text(x + width / 2, y + height / 2, 20, text, "black");
            top.ctx.textAlign = "left";
        }
    }

    this.setCookie = function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    this.getCookie = function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    this.lockScrollOnIpad = function() {
        top.lockScroll = true;
    }

    this.circle = function(x, y, rad, color, strokeColor, strokeWidth) {
        top.ctx.beginPath();
        top.ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
        top.ctx.fillStyle = color;
        top.ctx.fill();
        top.ctx.lineWidth = strokeWidth || 1;
        top.ctx.strokeStyle = strokeColor || color;
        if (strokeColor)
            top.ctx.stroke();
    }
    this.line = function(x1, y1, x2, y2, size, color) {
        top.ctx.beginPath();
        top.ctx.moveTo(x1, y1);
        top.ctx.lineTo(x2, y2);
        top.ctx.strokeStyle = color;
        top.ctx.lineWidth = size;
        top.ctx.stroke();
    }
    this.box = function(x, y, width, height, strokesize, color) {
        top.line(x, y, x + width, y, strokesize, color);
        top.line(x + width, y, x + width, y + height, strokesize, color);
        top.line(x, y, x, y + height, strokesize, color);
        top.line(x, y + height, x + width, y + height, strokesize, color);
    }
    this.ring = function(x, y, rad, color, strokeWidth) {
        top.ctx.lineWidth = strokeWidth;
        top.ctx.strokeStyle = color;
        top.ctx.beginPath();
        top.ctx.arc(x, y, rad, 0, 2 * Math.PI);
        top.ctx.stroke();
    }
    this.fill = function(x, y, width, height, coloro, colort) {
        var my_gradient = top.ctx.createLinearGradient(0, 0, 0, width);
        my_gradient.addColorStop(0, coloro);
        my_gradient.addColorStop(1, colort);
        top.ctx.fillStyle = my_gradient;
        top.ctx.fillRect(x, y, width, height);
    }
    this.getColor = function(x, y, w, h) {
        w = w || 1;
        h = h || 1;
        return top.ctx.getImageData(x, y, w, h).data;
    }
    
    this.distance = function(x1, y1, x2, y2) {
        if (x1.hasOwnProperty('x')) {
            var dx = x1.x - y1.x;
            var dy = x1.y - y1.y;
        } else {
            var dx = x1 - x2;
            var dy = y1 - y2;
        }

        return Math.sqrt(dx * dx + dy * dy);
    }
    
    this.angle = function(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    }

    this.clear = function() {
        top.ctx.clearRect(0, 0, c.width, c.height);
    }
    
    this.rect = function(x, y, width, height, color) {
        top.ctx.fillStyle = color;
        top.ctx.fillRect(x, y, width, height);
    }
    
    this.picture = function(x, y, file, width, height, onload = function() {}) {
        if (typeof this.pictures[file] === 'undefined') {
            this.pictures[file] = new Image();
            this.pictures[file].src = file;
            this.pictures[file].crossOrigin = "anonymous";

            this.pictures[file].onload = function() {
                onload();
                var c = document.getElementById(top.canvas);
                var ctx = c.getContext("2d");
                ctx.drawImage(top.pictures[file], x, y, width, height);
            }
        } else if (this.pictures[file].complete) {
            var c = document.getElementById(this.canvas);
            var ctx = c.getContext("2d");
            ctx.drawImage(this.pictures[file], x, y, width, height);
        }

    }
    
    this.random = function(max, intervalMax) {
        if (typeof(intervalMax) == 'undefined') {
            return Math.floor(Math.random() * max);
        } else {
            var diff = intervalMax - max;

            return max + Math.floor(Math.random() * (diff + 1));
        }
    }
    
    this.textMode = function(type) {
        if (!type)
            type = "";
        top.textModeValue = type;
    }
    
    this.text = function(x, y, size, text, color, font) {
        if (!(typeof font != 'undefined'))
            font = "Arial";
            
        top.ctx.fillStyle = color;
        top.ctx.font = top.textModeValue.toLowerCase() + " " + size + "px " + font;
        top.ctx.fillText(text, x, y);
    }

    this.randomColor = function() {
        var r = top.random(0, 255);
        var g = top.random(0, 255);
        var b = top.random(0, 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    this.average = function(list) {
        return list.reduce(function(a, b) {
            return a + b;
        }) / list.length;
    }
}