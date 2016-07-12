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

	ctor:function(){
		this._super();

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
		var action4 = cc.reverseTime(action3);
		var sequence = cc.sequence(action1,action2,action3,action2);
		this.fishHook.runAction(cc.repeatForever(sequence))

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




