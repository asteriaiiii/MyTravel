exports.login=function(){
	
	var login=Ti.UI.createView({
		layout:'vetical',
		backgroundColor:'#467cb3'
	});
	var txtUsername=Ti.UI.createTextField({
		hintText:'Username',
		top:2,
		height:40,
		width:Ti.UI.FILL
	});
	login.add(txtUsername);
	var txtPass=Ti.UI.createTextField({
		hintText:'Password',
		top: 45,
		height:40,
		passwordMask:true,
		width:Ti.UI.FILL
	});
	login.add(txtPass);
	var dialogLogin=Ti.UI.createOptionDialog({
		title:'Login',
		buttonNames:['Login','Cancel'],
		androidView:login
	});
	dialogLogin.addEventListener('click', function(e){
		if(e.index==0)
		{
			alert("Checking User");
		}
		else if(e.index==1)
		{
			
			
		}
		
	});
	dialogLogin.show();
}


