var canvas = document.getElementById('canvas1');
var context = canvas.getContext('2d');
//Math.PI:180°
var deg = Math.PI / 180;
//得分
var num = 0;
//矩形
//判断游戏暂停或继续的Boolean
var isStart = false;
//音乐判断
var a = true;
var snake = new Snake();
//times控制移动用时
var times = 0;
//计时
var t = 0;
var t1=0;
var food = createFood();

var timer = null;

function Rect(x, y, w, h, color) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;
}
Rect.prototype.draw = function() {

	context.beginPath();
	context.rect(this.x, this.y, this.w, this.h);
	context.fillStyle = this.color;
	context.fill();
	context.stroke();
}
Rect.prototype.move = function() {

	switch (snake.fx) {
		case 37:
			this.x -= this.w;
			break;
		case 38:
			this.y -= this.h;
			break;
		case 39:
			this.x += this.w;
			break;
		case 40:
			this.y += this.h;
			break;
	}
}

//蛇
function Snake() {
	//存储body
	this.bodyArr = [];
	//初始化运动方向
	this.fx = 37;
	//加锁，防止运动时间慢时，快速点击方向键造成反向运动
	this.update = true;
	for (var i = 0; i < 4; i++) {
		var body1 = new Rect(400 + i * 25, 300, 25, 25, "white");
		this.bodyArr.push(body1);
	}
	this.bodyArr[0].color = "gray";
}

Snake.prototype.move = function() {
		//运动时更新身体位置
		//创建一节新的蛇身
		var bodys = new Rect(this.bodyArr[0].x, this.bodyArr[0].y, this.bodyArr[0].w, this.bodyArr[0].h, "white");
		//运动后解锁
		this.update = false;
		//在下标为1的位置插入
		//将蛇身插入到蛇头后
		this.bodyArr.splice(1, 0, bodys);
		//当蛇头碰到食物后食物更新，否则蛇尾减一
		if ((food.x + food.w) == this.bodyArr[0].x && (food.y) == this.bodyArr[0].y && this.fx == 37 ||
			(food.y + food.h) == this.bodyArr[0].y && food.x == this.bodyArr[0].x && this.fx == 38 ||
			food.x == (this.bodyArr[0].x + this.bodyArr[0].w) && food.y == this.bodyArr[0].y && this.fx == 39 ||
			food.y == (this.bodyArr[0].y + this.bodyArr[0].h) && food.x == this.bodyArr[0].x && this.fx == 40) {
			//得分计数
			num += 1;
			document.getElementById("btn1").innerText = "得分:" + num;
			//更新食物
			food = createFood();

		} else {
			//删除最后一个
			this.bodyArr.pop();
		}

		this.bodyArr[0].move();
	}
	//撞墙
Snake.prototype.pWall = function() {
		if (this.bodyArr[0].x < 0 || this.bodyArr[0].y < 0 || this.bodyArr[0].x + this.bodyArr[0].w > canvas.width || this.bodyArr[0].y + this.bodyArr[0].h > canvas.height) {
			console.log("撞墙了");
			return false;
		}
		//          if(this.bodyArr[0].y < 0) {
		//              console.log("撞上墙了")
		//          }
		//          if(this.bodyArr[0].x+this.bodyArr[0].w > canvas.width) {
		//              console.log("撞右墙了")
		//          }
		//          if(this.bodyArr[0].y+this.bodyArr[0].h > canvas.height) {
		//              console.log("撞下墙了")
		//          }
		return true;
	}
	//撞身体
Snake.prototype.pSelf = function() {
	var ps = true;
	for (var i = 1; i < this.bodyArr.length; i++) {
		var br = this.bodyArr[i].x + this.bodyArr[i].w;
		var bb = this.bodyArr[i].y + this.bodyArr[i].h;
		var hr = this.bodyArr[0].x + this.bodyArr[0].w;
		var hb = this.bodyArr[0].y + this.bodyArr[0].h;
		if (this.bodyArr[0].x < br && this.bodyArr[0].y < bb && this.bodyArr[i].x < hr && this.bodyArr[i].y < hb) {
			console.log(1);
			ps = false;
			break;
		}
	}
	return ps;
}

function createFood() {
	//设置一个变量判断是否出现在蛇身上（有为true）
	var flag = true;
	//while循环设置食物出现的起点
	//当食物出现在蛇身上时（flag=true）循环设置起点直到不在蛇身上出现（flag=false）
	while (flag) {
		//食物的起点随机(800/25=31)
		var x = parseInt(rand(0, 31));
		var y = parseInt(rand(0, 31));
		//食物不能出现在身体上
		for (var i = 0; i < snake.bodyArr.length; i++) {
			if (snake.bodyArr[i].x == x * 25 && snake.bodyArr[i].y == y * 25) {
				flag = true;
				break;
			} else {
				flag = false;
			}
		}
	}
	//创建食物对象
	var food = new Rect(x * 25, y * 25, 25, 25, "red");
	//返回食物对象
	return food;
}

function rand(min, max) {
	return Math.random() * (max - min + 1) + min;
}



function ani() {	
		times++;
	if (times % 10 == 0) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		for (var i = 0; i < snake.bodyArr.length; i++) {
			snake.bodyArr[i].draw();
		}
		if(isStart){
			snake.move();
			t++;
			if(t%8==0){
				t1++;
		        document.getElementById("time").innerHTML ='计时:'+ t1+'s';
			}
			
		}	
		food.draw();
	}
	if (snake.pWall() && snake.pSelf()) {
		timer = window.requestAnimationFrame(ani);
	}
	else{		
			window.location.reload();	
	}
}
ani();
//键盘改变运动方向
document.onkeydown = function(e) {
	var ev = e || event;
	//没有锁的时候执行
	if (snake.update == false) {
		switch (ev.keyCode) {
			case 37:
				if (snake.fx != 39) {
					snake.fx = 37;
					snake.update = true;
				}
				break;
			case 38:
				if (snake.fx != 40) {
					snake.fx = 38;
					snake.update = true;
				}
				break;
			case 39:
				if (snake.fx != 37) {
					snake.fx = 39;
					snake.update = true;
				}
				break;
			case 40:
				if (snake.fx != 38) {
					snake.fx = 40;
					snake.update = true;
				}
				break;
			default:
				break;
		}
	}
}



function startGame() {
	console.log("暂停或继续游戏");
	//开始暂停键
	if (isStart) {
		document.getElementById("btn2").style.backgroundImage = "url(img/bofang.png)";
		console.log("暂停");
		isStart = false;
	} else {
		document.getElementById("btn2").style.backgroundImage = "url(img/zanting.png)";
		console.log("播放");
		isStart = true;
	}
}
//音乐开关
function musicPlay(){
	console.log("音乐");
	if(a){	
        document.getElementById("btn3").innerText = "PLAY MUSIC";    
		player.play();
		a=false;
	}else{
		document.getElementById("btn3").innerText = "STOP MUSIC";
		player.pause();
		a=true;
	}
	
	
}


