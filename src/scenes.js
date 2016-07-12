var GameScene = cc.Scene.extend({
	
	ctor:function(){
		this._super();

		/* 背景图片 */
		var bg = new cc.Sprite(res.gamebg);
		bg.x = Const.winWidth/2; 
		bg.y = Const.winHeight/2;
		var bgw = bg.width;
		var bgh = bg.height;
		bg.scaleX = Const.winWidth/bgw;
		bg.scaleY = Const.winHeight/bgh;

		this.addChild(bg);

		var gameLayer = new GameLayer();
		this.addChild(gameLayer);

		var scoreLayer = new ScoreLayer(gameLayer);
		this.addChild(scoreLayer);

	}
});


var GameLayer = cc.Layer.extend({
	score:0,
	hookcount:Const.HookChance,
	hooks:[],
	fishHook:null,
	fishes:[],

	fishtype:{
		l_1:{width:336,height:84},
		l_2:{width:400,height:80},
		l_3:{width:480,height:82},
		l_4:{width:400,height:80},
		m_1:{width:280,height:70},
		m_2:{width:280,height:55},
		m_3:{width:240,height:80},
		s_1:{width:240,height:30},
		s_2:{width:280,height:50}
	},

	ctor:function(){
		this._super();

		// 初始化鱼类
		this.initFishes();

		// 初始化钩子数量
		this.initHooks();

		// 初始化鱼钩
		this.fishHook = new cc.Sprite(res.hook);
		this.fishHook.anchorY = 0.3*Const.scaleX;

		this.fishHook.x = Const.winWidth/2;
		this.fishHook.y = this.fishHook.height*Const.scaleX*0.58;

		this.fishHook.scaleX = Const.scaleX;
		this.fishHook.scaleY = Const.scaleX;
		this.addChild(this.fishHook,20);

		// 钩子旋转
		var action1 = cc.rotateTo(1,40,0);
		var action2 = cc.rotateTo(1,0,0);
		var action3 = cc.rotateTo(1,-40,0);
		var sequence = cc.sequence(action1,action2,action3,action2);
		this.fishHook.runAction(cc.repeatForever(sequence));


	},

	fadeOutHook:function(){
		this.hookcount -= 1;
		this.hooks[this.hookcount].runAction(cc.fadeOut(1));
	},

	initHooks:function(){
		for(var i = 0; i < this.hookcount; i++){
			this.hooks[i] = new cc.Sprite(res.score_hook);
			this.hooks[i].y = Const.winHeight - this.hooks[i].height*Const.scaleX*0.5;
			this.hooks[i].x = Const.winWidth - this.hooks[i].width*Const.scaleX*i - this.hooks[i].width/2
			this.hooks[i].scaleX = Const.scaleX;
			this.hooks[i].scaleY = Const.scaleX;

			this.addChild(this.hooks[i]);
		}
	},

	initFishes:function(){
		//large fish
		var l = 5,m = 10,s = 20;
		while(l >= 1){
			var clip = new cc.ClippingNode();
			this.addChild(clip,2);
			var nd =  parseInt(Math.random()*4+1, 10);
			var l_fish = new cc.Sprite('src/img/l_'+ nd +'.png');
			clip.x = -1*l_fish.width;
			clip.y = parseInt(Math.random()*Const.winHeight*0.7 + Const.winHeight*0.1 , 10);
			l_fish.x = l_fish.width/2;
			l_fish.y = l_fish.height/2;
		
			this.fishes.push(clip);

			clip.addChild(this.fishes[this.fishes.length-1],1);

			var stencil = new cc.DrawNode();
			stencil.drawRect(cc.p(l_fish.x,l_fish.y),cc.p(l_fish.x+fishtype['l_'+nd].width/4,l_fish.y + fishtype['l_'+nd]).height,cc.color(0,0,0),1,cc.color(0,0,0));
			clip.stencil = stencil;

			var action1 = cc.moveTo(10,Const.winWidth+l_fish.width,l_fish.y);
			var action2 = cc.rotateTo(0.5,0,180);
			var action4 = cc.rotateTo(0.5,0,0);
			var action3 = cc.moveTo(10,-1*l_fish.width,l_fish.y);
			var sequence = cc.sequence(action1,action4,action3,action2);
			var repeat = cc.repeatForever(sequence);
			this.fishes[this.fishes.length-1].runAction(repeat);

			l-=1;
		}

		console.log('l')

		while(m >= 1){
			var m_fish = new cc.Sprite('src/img/m_'+ parseInt(Math.random()*3+1, 10) +'.png');
			m_fish.x = -1*m_fish.width;
			m_fish.y = parseInt(Math.random()*Const.winHeight*0.7 + Const.winHeight*0.1 , 10);
			
			// var action1 = cc.moveTo(10,Const.winWidth+l_fish.width,l_fish.y);
			// var action2 = cc.rotateTo(0.5,0,-180);
			// var action3 = cc.moveTo(10,-1*l_fish.width,l_fish.y);
			// var sequence = cc.sequence(action1,action2,action3);
			// var repeat = cc.repeatForever(sequence);

			this.fishes.push(m_fish);
			this.addChild(this.fishes[this.fishes.length - 1]);

			// this.fishes[-1].runAction(repeat);
			m-=1;
		}

		while(s >= 1){
			var s_fish = new cc.Sprite('src/img/s_'+ parseInt(Math.random()*2+1, 10) +'.png');

			s_fish.x = -1*s_fish.width;
			s_fish.y = parseInt(Math.random()*Const.winHeight*0.7 + Const.winHeight*0.1 , 10);
			
			this.fishes.push(s_fish);
			this.addChild(this.fishes[this.fishes.length - 1]);
			s-=1;
		}

		

	}
});

var ScoreLayer = cc.Layer.extend({
	scoreText:null,
	gameLayer:null,
	scorew:null,

	ctor:function(gamelayer){
		this._super();
		this.gameLayer = gamelayer;
		var scorepanel = new cc.Sprite(res.score_board);
		this.scorew = scorepanel.width;
		var scoreh = scorepanel.height;
		scorepanel.scaleX = Const.winWidth*0.4/this.scorew;
		scorepanel.scaleY = Const.winWidth*0.4/this.scorew;
		scorepanel.x = Const.winWidth*0.8; 
		scorepanel.y = Const.winHeight*0.87;

		this.addChild(scorepanel);

		// 分数
		var scoreText = new cc.LabelTTF('分数：0','arial','36');
		scoreText.x = this.scorew/2 - scoreText.width/2;
		scoreText.y = scoreText.height/2;
		scoreText.setColor(cc.color(255,255,255));
		this.scoreText = scoreText;
		scorepanel.addChild(scoreText);

		//更新分数
		this.scheduleUpdate();

	},

	update:function(){
		
		var scorestr = '分数：' + this.gameLayer.score;
		this.scoreText.setString(scorestr);
		this.scoreText.x = this.scorew/2;
	}

});

var StartScene = cc.Scene.extend({
	onEnter:function(){
		this._super();

		/* 背景图片 */
		var bg = new cc.Sprite(res.start_bg);
		bg.x = Const.winWidth/2; 
		bg.y = Const.winHeight/2;
		var bgw = bg.width;
		var bgh = bg.height;
		console.log(bgw);
		bg.scaleX = Const.winWidth/bgw;
		bg.scaleY = Const.winHeight/bgh;

		this.addChild(bg);

		/* 游戏开始按钮 */
		var startBtn = new cc.MenuItemImage(res.start_btn,res.start_btn,res.start_btn,this.startGame,this);
		startBtn.x = 0; 
		startBtn.y = Const.winHeight*0.3*-1;
		startBtn.scaleX = Const.winWidth/bgw;
		startBtn.scaleY = Const.winHeight/bgh;

		var menu = new cc.Menu(startBtn);
		this.addChild(menu);
	},

	startGame:function(){
		cc.director.runScene(new GameScene());
	}
});




