function ready(){
    var url = window.location.href;
    url = url.split('/');
    var table = document.getElementById('table_id');
    if(table != null){
        $('#table_id').DataTable();
    }
    if(url[3] == ''){
        url[3] = '/'
    }
    $('.nav li a[href="'+url[3]+'"]').addClass('active');
}