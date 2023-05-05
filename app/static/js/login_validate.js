// Função para enviar os dados do registro para o servidor
function register() {
    // Obter os dados do formulário
    var email = document.getElementById('emailRegister').value;
    var password = document.getElementById('passwordRegister').value;
    var confirmPassword = document.getElementById('passwordRegister2').value;

    // Fazer uma requisição POST para o servidor
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/register', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Registro bem-sucedido, atualizar o container de registro com uma mensagem de sucesso
                var response = JSON.parse(xhr.responseText);
                var message = response['message'];
                document.getElementById('form-register-new-votagem').innerHTML = '<p>' + message + '</p>';
            } else {
                // Mostrar mensagem de erro no container de registro
                var response = JSON.parse(xhr.responseText);
                var error = response['error'];
                // Faça algo com o erro, por exemplo, exibir uma mensagem de erro no formulário
                document.getElementById('form-register-new-votagem').innerHTML = '<p>Error: ' + error + '</p>';
            }
        }
    };
    // Prepare os dados a serem enviados no formato de requisição x-www-form-urlencoded
    var data = 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password) + '&confirmPassword=' + encodeURIComponent(confirmPassword);
    // Enviar os dados para o servidor
    xhr.send(data);
}
