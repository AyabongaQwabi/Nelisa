


  //--------------------------------------------------------------------------//

        var categoryList         = $('#product_categories').html();
        var categoryListTemplate =Handlebars.compile(categoryList);
        function getProductCategories(){

            $('#productCategories').click(function(){
              $.get('/categories',function(data){
                 
                  var html = categoryListTemplate({productCategories:data});
                   $('#main').css({display:'none'})
                  $('#main').html(html)
                            .fadeIn('fast')
                            .animate({width:'50vw'})
              })
            })
        }

  //--------------------------------------------------------------------------//

        var perfomances         = $("#perfomances").html();
        var perfomancesTemplate =Handlebars.compile(perfomances);
        function getProductPerfomances(){

          $('#productPerfomances').click(function(){
              var html = perfomancesTemplate();
               $('#main').css({display:'none'})
                  $('#main').html(html)
                            .fadeIn('fast')
                            .animate({width:'50vw'})
          })
        }

  //--------------------------------------------------------------------------//
        var count =0;
        var _productList        = $('#productlist').html();
        var productListTemplate = Handlebars.compile(_productList);
        function getProductList(){
            var productTableIstopen =false;
            $('#listProducts').click(function(){
              $.get('products/all',function(data){
               
               var html = productListTemplate({products:data});
               $('#main').css({display:'none'})
                  $('#main').html(html)
                            .fadeIn('fast')
                            .animate({width:'50vw'})
               })

            })

        }

 //--------------------------------------------------------------------------//

        var addProductHtml     = $("#add-Products").html();
        var addProductTemplate = Handlebars.compile(addProductHtml)
        function PrepareNewProduct(){

            $("#addProduct").click(function(){
                $.get('/categories',function(data){
                 
                  var html = addProductTemplate({productCategories:data});
                  $('#main').css({display:'none'})
                  $('#main').html(html)
                            .fadeIn('fast')
                            .animate({width:'50vw'})
                            
                 

              })
            });
        }

//---------------------------------------------------------------------------//

        var deleteProductHtml     = $('#delete-product').html();
        var deleteProductTemplate = Handlebars.compile(deleteProductHtml)
        function PrepareProductDeletion(){

            $('#deleteProduct').click(function(){
              $.get('products/all',function(data){

                 var CompiledDeletehtml = deleteProductTemplate({products :data});
                  $('#main').css({display:'none'})
                  $('#main').html(CompiledDeletehtml)
                            .fadeIn('fast')
                            .animate({width:'50vw'})
              })
            });

        }


$('#productsTable').keypress(function(e) {
       alert('Key Pressed');
                           
                                    
      });
          