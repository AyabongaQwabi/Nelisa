$(document).ready(function(){
	$('input').keypress(function(){
		$(this).css({padding:'1.5%',background:'lightgrey'})
	})
	$('#done').click(function(){
		validate("#username");	
			
		validate("#secpass")
		
		if(!validate("#firstpass")){

			if($('#firstpass').val() == $('#secpass').val()){
				$('form').submit();
			}
			else{
				popUp('Your Passwords do not Match')
		    }	
		 }
		
	})
	$('#cancel').click(function(){
		window.location.href='/login'
	})
})



function validate(div){
		if($(div).val()==''){

			popUp("Please Fill In All Fields")
			$(div).css({background:'tomato'})
			return false
		}
		else{
			return true
		}
}



function popUp(popUpText){

	jQuery('<div>',{
		    id:'popUp',
		    style:'z-index:50000;font-size:3vw;font-weight:900;border:2px solid black;box-shadow:1px 1px 30px 5px black;padding:5%;position:absolute;background:rgba(255,165,0,0.9);width:auto;height:auto;margin:auto;top:30%;left:30%;color:black;',
		    text:popUpText
	}).appendTo('body');

	setTimeout(function(){
		$('#popUp').fadeOut(500);
		setTimeout(function(){
			$('#popUp').remove();
		},2000)

	},800)
}




function addUser(name,pass){

	$.post('/register',{username:name,password:pass},function(){
		success();
	})

}

function success(){
	popUp("Succesful Registration !")
	$('input').val('')
}