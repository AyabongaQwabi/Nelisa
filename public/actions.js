function postProduct(nameDiv,catIdDiv){
	var name = $(nameDiv).val();
	var catId = $(catIdDiv).val();

	var data ={name:name,cat:catId};
	$.post('/products/add',data,function(){
		$(nameDiv).val('');
		
		popUp('Succesfuly Added '+name)
	})

}
function updateProduct(nameDiv,catIdDiv,ID){

	var name = $(nameDiv).val();	
	var catName= $(catIdDiv).val();


    
	$.get('/categories',function(data){
			if(!_.any(data,'name',catName)){
				popUp("Category does not exist")
			}
			else{
				var category_id = _.find(data, function(chr) {
									
								  return chr.name == catName
								})['id'];

				
				data ={name:name,id:ID,category_id:category_id}
				$.post('products/update',data,popUp('Success >>  Name: '+name+"                       Category: "+catName))
			}
	})

}

function deleteProduct(IDDiv){
	
	var productID = $(IDDiv).val();
	
	var data ={id:productID};
	$.post('/products/delete',data,function(){

		var optionID ='#'+productID;		
		var selector =IDDiv +" option:selected"
		var productName = $(selector).text();
		var text ="Succesfuly Deleted "+productName;
		$(IDDiv).find(optionID).remove();		
		popUp(text);
		
	});
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

$(document).ready(function(){
	$('#productsMenu').animate({width:'+=10%',height:'+=10%'})
       
	$('#main').css('opacity','0')
	setTimeout(function(){
		$('#main').animate({opacity:'1'},500)
	},600)




	                                 
                   
                






	
})