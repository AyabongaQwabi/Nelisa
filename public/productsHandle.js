if(userlevel()==2){
	$('#addProduct').remove();
	$('#deleteProduct').remove();
	$('#updateProdBtn').remove();
}


                     
$('input#searchbar').keyup(function(e){
    	
       
        var pressed = String.fromCharCode(e.keyCode)        
        var search = $('#searchbar').val();        
        if(search==''){        	
        	    var tableHtml ="<table id='results'>"
	        	tableHtml+="<tr><td><button class='btn btn-warning' id='closesearch' onclick='returnOriginalHtml()'>close search</button></td></tr>"
        		 
	            tableHtml+='</table>'	    
	            $('#main').html(tableHtml)
	          
        }
        else{

        	var query ="/api/products/search/:"+search;	       
	        $.get(query,function(data){
	        	
	        	var tableHtml = "<div id='resultsDiv'>"+
	        					"<button class='btn btn-warning' id='closesearch' onclick='returnOriginalHtml()'>close search</button>"+
	        	                "<table id='results'>"
	        	
	        	if(!(data.length>=1)){
	        		tableHtml+="<tr><td><i> * No results for search *</i></td></tr>"
	        		
	        	}
	        	else{
	        		
	          		data.forEach(function(dat){
	          			
	          			if(dat.type=='category'){
	          				tableHtml+=("<tr style='background:orange;color:black;'><td onclick=loadPage("+dat.id+",\'"+dat.type+"\')>"+dat.name+"</td></tr>")
	          			}
	          			else{
	          				tableHtml+=("<tr><td onclick=loadPage("+dat.id+",\'"+dat.type+"\')>"+dat.name+"</td></tr>")
	          			}
	            		
	          		})
	        	}
	          
	          tableHtml+='</table></div>'	          
	          $('#main').html(tableHtml)	          
	        })
        }      

    })



function loadPage(id,type){
	   console.log('loading page')
       console.log('id:'+id+' type:'+type)
       PrepareTemplate(id,type)
}
function returnOriginalHtml(){
    	
    	var originalHmtl="<div id='first'><h1> Product Management Section </h1></div>"
    	$('#main').fadeOut();
    	setTimeout(function(){
    		$('#main').html(originalHmtl)
    	},400)
    	$('#main').fadeIn();
    	$('#searchbar').val('')
    			  
    }
