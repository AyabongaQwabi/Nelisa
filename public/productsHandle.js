if(userlevel()==2){
	$('#addProduct').remove();
	$('#deleteProduct').remove();
	$('#updateProdBtn').remove();
}


                     
$('input#searchbar').keyup(function(e){
    	
        console.log('\n\n--------------------START------------------------------')
        var pressed = String.fromCharCode(e.keyCode)
        console.log('Triggered :'+pressed)
        var search = $('#searchbar').val();
        console.log('searching for:'+search)
        if(search==''){
        	console.log('search var is empty')
        	    var tableHtml ="<table id='results'>"
	        	tableHtml+="<tr><td><button class='btn btn-warning' id='closesearch' onclick='returnOriginalHtml()'>close search</button></td></tr>"
        		 
	            tableHtml+='</table>'

	    
	          $('#main').html(tableHtml)
	          console.log('\n\n--------------------END------------------------------')
        }
        else{
        	var query ="/api/products/search/:"+search;
	        console.log('Query:'+query)
	        $.get(query,function(data){
	        	console.log('Results:')
	        	var tableHtml ="<table id='results'>"
	        	tableHtml+="<tr><td><button class='btn btn-warning' id='closesearch' onclick='returnOriginalHtml()'>close search</button></td></tr>"
	        	if(!(data.length>=1)){
	        		tableHtml+="<tr><td><i> * No results for search *</i></td></tr>"
	        		console.log('*No results*')
	        	}
	        	else{
	        		
	          		data.forEach(function(dat){
	          			console.log(dat.name)
	          			if(dat.type=='category'){
	          				tableHtml+=("<tr style='background:orange;color:black;'><td>"+dat.name+"</td></tr>")
	          			}
	          			else{
	          				tableHtml+=("<tr><td>"+dat.name+"</td></tr>")
	          			}
	            		
	          		})
	        	}
	          
	          tableHtml+='</table>'

	          console.log('loading data on div')
	          $('#main').html(tableHtml)
	          console.log('\n\n--------------------END------------------------------')
	        })
        }
        

    })

function returnOriginalHtml(){
    	
    	var originalHmtl="<div id='first'><h1> Product Management Section </h1></div>"
    	$('#main').fadeOut();
    	setTimeout(function(){
    		$('#main').html(originalHmtl)
    	},400)
    	$('#main').fadeIn();
    	$('#searchbar').val('')
    			  
    }
