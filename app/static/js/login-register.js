function register(){
    const form = document.getElementById('form-register-new-votagem');

    // const border = document.getElementsByClassName('data-login-cadastre');


    const emailRegister = document.getElementById('emailRegister');
    const labelEmailRegister = document.getElementById('labelEmailRegister');

    const passwordRegister = document.getElementById('passwordRegister');
    const labelPasswordRegister = document.getElementById('labelPasswordRegister');

    const passwordRegister2 = document.getElementById('passwordRegister2');
    const labelPasswordRegister2 = document.getElementById('labelPasswordRegister2');

    form.addEventListener('submit', e => {
        e.preventDefault();
        validadeInputs();
    });

    const setError = (element, message) =>  {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    };

    const setSuccess = element =>{
        const inputControl = element.parentElement;
        const errorDispay = inputControl.querySelector('.error');
        errorDispay.innerText = '';
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    };

    const isValidEmail = email => {
        const re =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;;
        return re.test(String(email).toLowerCase());
    }

    const validadeInputs = () =>{
        const emailValueRegister = emailRegister.value.trim();
        const passwordValueRegister = passwordRegister.value.trim();
        const password2ValueRegister = passwordRegister2.value.trim();



        if (emailValueRegister === '') {
            setError(labelEmailRegister, 'Email is required');
            emailVerifyRegister = false;
        }else if(!isValidEmail(emailValueRegister)){
            setError(labelEmailRegister, 'Provide a valid email address')
            emailVerifyRegister = false;
        }else{
            setSuccess(labelEmailRegister);
            emailVerifyRegister = true;
        }

        if(passwordValueRegister === ''){
            setError(labelPasswordRegister, 'Password is required');
            passwordOldverifyRegister = false;
        }else if(passwordValueRegister.length < 4){
            setError(labelPasswordRegister, 'Password must be at least 8 character');
            passwordOldverifyRegister = false;
        }else{
            setSuccess(labelPasswordRegister);
            passwordOldverifyRegister = true;
        }

        if (password2ValueRegister === '') {
            setError(labelPasswordRegister2, 'please confirm your password');
            passwordConfirmVerifyRegister = false;
        } else if(password2ValueRegister !== passwordValueRegister){
            setError(labelPasswordRegister2, 'Password doesnt match');
            passwordConfirmVerifyRegister = false;
        }else{
            setSuccess(labelPasswordRegister2);
            passwordConfirmVerifyRegister = true;
        }

        if(emailVerifyRegister!==false && passwordOldverifyRegister!==false && passwordConfirmVerifyRegister!==false){
            submit();

        }
    };
}
function login(){
    const formLogin = document.getElementById('form-confirm-new-votagem');

    // const border = document.getElementsByClassName('data-login-cadastre');

    const email = document.getElementById('emailLogin');
    const labelEmail = document.getElementById('labelEmailLogin');

    const password = document.getElementById('passwordLogin');
    const labelPassword = document.getElementById('labelPasswordLogin');

    formLogin.addEventListener('submit', e => {

        // for (let index = 0; index < border.length; index++) {
        //     border[index].classList.remove('border-label');
        // }

        validadeInputs();

        e.preventDefault();
    });

    const setError = (element, message) =>  {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        errorDisplay.innerText = message;
        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    };

    const setSuccess = element =>{
        const inputControl = element.parentElement;
        const errorDispay = inputControl.querySelector('.error');
        errorDispay.innerText = '';
        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    };

    const isValidEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const validadeInputs = () =>{
        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();

        if (emailValue === '') {
            setError(labelEmail, 'Email is required');
            emailVerify = false;
        }else if(!isValidEmail(emailValue)){
            setError(labelEmail, 'Provide a valid email address');
            emailVerify = false;
        }else{
            setSuccess(labelEmail);
            emailVerify = true;
        }

        if(passwordValue === ''){
            setError(labelPassword, 'Password is required');
            passwordConfirmVerify = false;
        }else if(passwordValue.length < 5){
            setError(labelPassword, 'Password must be at least 8 character');
            passwordConfirmVerify = false;
        }else{
            setSuccess(labelPassword);
            passwordConfirmVerify = true;
        }

        if(emailVerify!==false &&  passwordConfirmVerify!==false){
            submit();
        }
    };
}

function showPassword(){
    $("input:checkbox").on('click', function() {
        // in the handler, 'this' refers to the box clicked on
        var $box = $(this);
        if ($box.is(":checked")) {
            // the name of the box is retrieved using the .attr() method
            // as it is assumed and expected to be immutable
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            // the checked state of the group/box on the other hand will change
            // and the current value is retrieved using .prop() method
            $(group).prop("checked", false);
            $box.prop("checked", true);
            var password = document.getElementsByClassName("register-password");
            for (let index = 0; index < password.length; index++) {
                if (password[index].type === 'password') {
                    password[index].type = 'text';
                }else{
                    password[index].type = 'password';
                }

            }
        } else {
            $box.prop("checked", false);
            var password = document.getElementsByClassName("register-password");
            for (let index = 0; index < password.length; index++) {

                password[index].type = 'password';


            }
        }
    });
}
