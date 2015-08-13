
  //--------------------------------------------------------------------------//
        var count =0;
        var usershtml       = $('#userlist').html();
        var userListTemplate = Handlebars.compile(usershtml);
        function getUserList(){
            var UserTableIsOpen =false;
            $('#view').click(function(){
              
             var html = userListTemplate(); 
             $('#content').animate({height:'0vw'})
                              .css({visibility:'hidden'})
                  $('#content').html(html)
                              .css({visibility:'visible'})
                            .fadeIn('fast')
                            .animate({height:'80vh'})
               })

            }

 //--------------------------------------------------------------------------//

        var adduserHtml     = $("#addUsertemplate").html();
        var adduserTemplate = Handlebars.compile(adduserHtml)
        function PrepareNewUser(){

            $("#addUser").click(function(){
             
                 OpenPopUp()
                  var html = adduserTemplate();
                  $('#content').animate({height:'0vw'})
                              .css({display:'none'})
                  $('#content').html(html)
                            .fadeIn('fast')
                            .animate({height:'40vh'})
                            
                 

            });
        }

//---------------------------------------------------------------------------//

        var deleteuserHtml     = $('#deleteUsertemplate').html();
        var deleteuserTemplate = Handlebars.compile(deleteuserHtml)
        function PrepareUserDeletion(){

            $('#deleteUser').click(function(){
        

                 var CompiledDeletehtml = deleteuserTemplate();
                  $('#content').animate({height:'0vw'})
                              .css({display:'none'})
                              
                  $('#content').html(CompiledDeletehtml)
                            .fadeIn('fast')
                            .animate({height:'40vh'})

            });

        }
 
 function closePopUp(){
    $('#content').css({display:'none'})
 }

 function OpenPopUp(){
    $('#content').css({display:'block'})
 }
          
      