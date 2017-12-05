window.addEventListener('load', function () {
    var webAuth = new auth0.WebAuth({
        domain: 'bec-authen-demo.auth0.com',
        clientID: '9IV6QCG9cvfOfYouYJsxuZhpbbUDcByu',
        responseType: 'token id_token',
        audience: 'http://localhost:56706/api',
        scope: 'openid',
        redirectUri: window.location.href
        //redirectUri: 'https://bec-authen-demo.auth0.com/userinfo'
    });
    
  
    const btnLogin = document.getElementById('btnLogin');
    
    var loginBtn = document.getElementById('btn-login');
    
    //Login event
    loginBtn.addEventListener('click', e => {

        e.preventDefault();
        webAuth.authorize();
    });

    // ...
    var loginStatus = document.querySelector('.container h4');
    var loginView = document.getElementById('login-view');
    var homeView = document.getElementById('home-view');

    // buttons and event listeners
    var homeViewBtn = document.getElementById('btn-home-view');
    var loginBtn = document.getElementById('btn-login');
    var logoutBtn = document.getElementById('btn-logout');

    homeViewBtn.addEventListener('click', function () {
        homeView.style.display = 'inline-block';
        loginView.style.display = 'none';
    });

    logoutBtn.addEventListener('click', logout);

    function handleAuthentication() {
        webAuth.parseHash(function (err, authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                setSession(authResult);
                loginBtn.style.display = 'none';
                homeView.style.display = 'inline-block';
                
            } else if (err) {
                homeView.style.display = 'inline-block';
                console.log(err);
                alert(
                    'Error: ' + err.error + '. Check the console for further details.'
                );
            }
            displayButtons();
        });
    }

    function setSession(authResult) {
        // Set the time that the access token will expire at
        var expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );
        localStorage.setItem('access_token', authResult.accessToken);
        
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);

        var id_token = localStorage.getItem('id_token');
        if (id_token) {
            console.log('id_token ' + id_token);
        }
        console.log('access_token ' + authResult.accessToken);
    }

    function logout() {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        displayButtons();
    }

    function isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    function displayButtons() {
        if (isAuthenticated()) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            loginStatus.innerHTML = 'You are logged in!';
        } else {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            loginStatus.innerHTML =
                'You are not logged in! Please log in to continue.';
        }
    }

    handleAuthentication();
});



