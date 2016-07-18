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
		this.addChild(gameLayer,2);

		var scoreLayer = new ScoreLayer(gameLayer);
		this.addChild(scoreLayer,1);

	}
});


var GameLayer = cc.Layer.extend({
	score:0,
	hookcount:Const.HookChance,
	hooks:[],
	fishHook:null,
	fishesL:[],
	fishLayerL:[],
	fishesM:[],
	fishLayerM:[],
	fishesS:[],
	fishLayerS:[],
	largeFish:Const.largeFish,
	middleFish:Const.middleFish,
	smallFish:Const.smallFish,

	fishtype:{
		l_1:{width:336,height:84},
		l_2:{width:336,height:84},
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
		
		var l = 6,m = 4,s = 2;
		while (l > 0) {
			var lrd = parseInt(Math.random()*3+1);
			var lf = new cc.Sprite("src/img/l_"+lrd+".png");
			var l_layer = new cc.Layer();

			// 鱼的大小
			var lw = this.fishtype["l_"+lrd].width/4;
			var lh = this.fishtype["l_"+lrd].height;
			lf.anchorX = 0;
			lf.anchorY = 0;

			//鱼的啥位置
			l_layer.y = Math.random()*(Const.winHeight*0.5 - lh)+Const.winHeight*0.2-lh;
			var direction = parseInt(Math.random()*99+1) % 2 == 0 ? 1 : -1;
			// var direction = 1;
			if(direction == 1){
				//当方向右边的时候
				l_layer.x = direction*1.2*lw + Const.winWidth + l*25;
			}else{
				//当方向是在左边的时候
				l_layer.x = direction*1.2*lw - l*100;
			}

			lf.x = 0;
			lf.y = 0;
			l_layer.anchorX = 0;
			l_layer.anchorY = 0;
			this.addChild(l_layer);

			//鱼的遮罩
			var clippingPanel = new cc.ClippingNode();
			l_layer.addChild(clippingPanel,2);
			clippingPanel.addChild(lf,1);
			var stencil = new cc.DrawNode();
			stencil.drawRect(cc.p(lf.x,lf.y+lh),cc.p(lf.x+lw,lf.y),cc.color(0,0,0),1,cc.color(0,0,0));
			clippingPanel.stencil = stencil;

			//添加到数组中
			this.fishesL.push(lf);
			this.fishLayerL.push(l_layer);

			//鱼的自身动画
			var flen = this.fishesL.length;
			var ylen = this.fishLayerL.length;
			this.animateFish(this.fishesL[flen-1],lw,lf.x,20);
			this.animateFishLayer(this.fishLayerL[ylen-1], l_layer.y ,lw,20,direction,this.fishesL[flen-1],l_layer.x);
			
			l-=1;
		}

		while (m > 0) {
			var mrd = parseInt(Math.random()*2+1);
			var mf = new cc.Sprite("src/img/m_"+mrd+".png"); 
			var m_layer = new cc.Layer();

			// 鱼的大小
			var mw = this.fishtype["m_"+mrd].width/4;
			var mh = this.fishtype["m_"+mrd].height;
			mf.anchorX = 0;
			mf.anchorY = 0;
			m_layer.anchorX = 0;
			m_layer.anchorY = 0;

			//鱼的啥位置
			m_layer.y = Math.random()*(Const.winHeight*0.5 - mh)+Const.winHeight*0.2 - mh;
			var direction = parseInt(Math.random()*99+1) % 2 == 0 ? 1 : -1;
			// var direction = 1;
			if(direction == 1){
				//当方向右边的时候
				m_layer.x = direction*1.2*mw + Const.winWidth + m*20;
			}else{
				//当方向是在左边的时候
				m_layer.x = direction*1.2*mw - m*50;
			}
			mf.x = 0;
			mf.y = 0;

			this.addChild(m_layer);

			//鱼的遮罩
			var clippingPanel = new cc.ClippingNode();
			m_layer.addChild(clippingPanel,2);
			clippingPanel.addChild(mf,1);
			var stencil = new cc.DrawNode();
			stencil.drawRect(cc.p(mf.x,mf.y+mh),cc.p(mf.x+mw,mf.y),cc.color(0,0,0),1,cc.color(0,0,0));
			clippingPanel.stencil = stencil;

			//添加到数组中
			this.fishesM.push(mf);
			this.fishLayerM.push(m_layer);

			//鱼的自身动画
			var flen = this.fishesM.length;
			var ylen = this.fishLayerM.length;
			this.animateFish(this.fishesM[flen-1],mw,mf.x,15);
			this.animateFishLayer(this.fishLayerM[ylen-1], m_layer.y ,mw,15,direction,this.fishesM[flen-1],m_layer.x);

			m-=1;
		}
		
		while (s > 0) {
			var srd = parseInt(Math.random()+1);
			var sf = new cc.Sprite("src/img/s_"+srd+".png");
			var s_layer = new cc.Layer();

			// 鱼的大小
			var sw = this.fishtype["s_"+srd].width/4;
			var sh = this.fishtype["s_"+srd].height;
			sf.anchorX = 0;
			sf.anchorY = 0;
			s_layer.anchorX = 0;
			s_layer.anchorY = 0;
			
			//鱼的啥位置
			s_layer.y = Math.random()*(Const.winHeight*0.5 - sh) + Const.winHeight*0.2 - sh;
			var direction = parseInt(Math.random()*99+1) % 2 == 0 ? 1 : -1;
			// var direction = 1;
			if(direction == 1){
				//当方向右边的时候
				s_layer.x = direction*1.2*sw + Const.winWidth + s * 50;
			}else{
				//当方向是在左边的时候
				s_layer.x = direction*1.2*sw - s * 30;

			}
			sf.x = 0;
			sf.y = 0;

			this.addChild(s_layer);

			//鱼的遮罩
			var clippingPanel = new cc.ClippingNode();
			s_layer.addChild(clippingPanel,2);
			clippingPanel.addChild(sf,1);
			var stencil = new cc.DrawNode();
			stencil.drawRect(cc.p(sf.x,sf.y+sh),cc.p(sf.x+sw,sf.y),cc.color(0,0,0),1,cc.color(0,0,0));
			clippingPanel.stencil = stencil;

			this.fishesS.push(sf);
			this.fishLayerS.push(s_layer);
			//鱼的自身动画
			var flen = this.fishesS.length;
			var ylen = this.fishLayerS.length;
			this.animateFish(this.fishesS[flen-1],sw,sf.x,10);
			this.animateFishLayer(this.fishLayerS[ylen-1], s_layer.y ,sw,10,direction,this.fishesS[flen-1],s_layer.x);
			s-=1;
		}


	},

	animateFishLayer:function(layer,y,w,duration,direction,fish,x){
		var action,reverse,sequence,scale,scale2 = cc.scaleTo(0,1,1);
		console.log(x)
		if(direction == 1){
			scale = cc.scaleTo(0,-1,1);
			action = cc.moveTo(duration, (x - Const.winWidth)*-1, y);
			reverse = cc.moveTo(duration,x, y);
			sequence = cc.sequence(scale2,action,scale,reverse);
		}else{
			scale = cc.scaleTo(0,-1,1);
			action = cc.moveTo(duration,Const.winWidth+x*-1, y);
			reverse = cc.moveTo(duration,x, y);
			sequence = cc.sequence(scale,action,scale2,reverse);
		}
		
		layer.runAction(cc.repeatForever(sequence));
	},

	animateFish:function(fish,width,x,duration){

		var ii = 0;
		setInterval(function(){
			fish.x = x - width*ii;
			
			if(ii == 3){
				ii = 0
			}else{
				ii+=1;
			}
			
		},150);
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

		console.log('Const.winWidth=',Const.winWidth)

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




