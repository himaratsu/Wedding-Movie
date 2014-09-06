exports.index = function(req, res){

	//ユーザーエージェント取得
	var ua = req.headers['user-agent'].toLowerCase();

	//テンプレート切り替え
	if(ua.indexOf("android") != -1 || ua.indexOf("iphone") != -1 || ua.indexOf("ipod") != -1){
		//スマートフォン用テンプレート
		console.log("sp");
		res.render('index_m', { title: 'スマートフォンサイト' });
	}
	else{
		//PC用テンプレート
		console.log("pc");
		res.render('index', { title: 'PCサイト' });
	}

};