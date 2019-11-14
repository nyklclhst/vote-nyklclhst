function check() {
    let pass = document.getElementById('pass').value;
    let c_pass = document.getElementById('c_pass').value;
    if (pass != c_pass) {
        document.getElementById('message1').style.color = 'red';
        document.getElementById('message1').innerHTML = 'Password Not Matching';
    }
    if(pass == c_pass){
        document.getElementById('message1').style.color = 'green';
        document.getElementById('message1').innerHTML = 'Password Matching';
    }
    if(pass.length < 8){
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'Password must at least 8 character';
    }
    if(pass.length >= 8){
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = '';
    }
    if(pass.length >= 8 && pass == c_pass){
        document.getElementById('regis').disabled = false;
    }
}