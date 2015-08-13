
function addUser(name,entry){
	var n =$(name).val();
	var e =$(entry).val();
	data = {username:n,entry_level:e}
	console.log(JSON.stringify(data))
	$.post('/users/add',data,function(){
			popUp('done')
	})
}


function updateUser(id,name,entry){
	var nameval = $(name).val();
	var entryval = $(entry).val();
	//alert('Entry val is now'+ entryval)
	console.log(entry+" "+entryval)
	var idval =$(id).attr('id');
	data = {username:nameval,entry_level:entryval,id:idval}
	console.log(data)
	$.post('/users/update',data,function(){
			popUp('done')
	})
}

function deleteUser(id){
	data = {id:id}
	id="#"+id
	$(id).remove();
	

	$.post('/users/delete',data,function(){
			popUp('Deleted')
	})
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