//get current location
const getCurrentLocation =() => {
    const currentLocation = document.querySelector('[current-location').value;
    console.log(currentLocation);
    return currentLocation;
};

// getEmployeeId
const getEmployeeData = () =>{
    let target = event.target;
    let employeeId = target.parentNode.childNodes[3].innerText;
    let data = {'employee_id':employeeId}
    let csrfToken = document.cookie.split(';')[0].split('=')[1];
    let url = ` 'http://{getcurrentLocation}/home/employee-info/'`;
    postData(url, data, csrfToken)
    .then(response=> {
        popEmployee(JSON.parse(response), employeeId);
        console.log(response);
    }) 
    .catch(error => console.error(error));
   
};

//employee assets ajax request
const getEmployeeAssets =() =>{    
    let id = document.querySelector('[personal-details] #employee-id').innerText
    let data = {'id':id};
    let csrfToken = document.cookie.split(';')[0].split('=')[1];
    console.log(csrfToken);
    let url =  `'http://{getcurrentLocation}/home/employee-assets/'`

    postData(url, data, csrfToken)
    .then(response =>{
        console.log(response);
    })
    
};

//pop employee details modal
const popEmployee = (employeeData, employeeId) =>{
    console.log(employeeData);    
    document.querySelector('[personal-details] #full-name').innerText = `Full Name: ${employeeData[0]['fields']['first_name']} ${employeeData[0]['fields']['last_name']}`;
    document.querySelector('[personal-details] #email-address').innerText = `Email Address: ${employeeData[0]['fields']['email']}`;
    document.querySelector('[personal-details] #contact-number').innerText= `Phone Number: ${employeeData[0]['fields']['contact_number']}`;
    document.querySelector('[personal-details] #kra-pin').innerText= `KRA-pin: ${employeeData[0]['fields']['kra_pin']}`;
    document.querySelector('[personal-details] #date-joined').innerText= `Date Joined: ${employeeData[0]['fields']['date_joined']}`;
    document.querySelector('[personal-details] #date-of-birth').innerText = `D.O.B: ${employeeData[0]['fields']['date_of_birth']}`;
    document.querySelector('[personal-details] #id-number').innerText= `ID-Number: ${employeeData[0]['fields']['id_number']}`;
    document.querySelector('[personal-details] #employee-id').innerText= employeeId;
    console.log(document.querySelector('[personal-details] #full-name'));
    showEmployeeDetails();
    fadeAdminNav();
    fadeEmployerData();
};

//sign up data
const createEmployee =()=>{
    let errorField = document.querySelector('[add-employee-modal] #error-message')
    let csrfToken = document.cookie.split(';')[0].split('=')[1];
    let email = document.querySelector('[add-employee-form] #employee_email_address').value;
    let firstName = document.querySelector('[add-employee-form] #employee_first_name').value;
    let LastName = document.querySelector('[add-employee-form] #employee_last_name').value;
    let randomPassword = randomPass(10);
    let data = {'first_name':firstName, 'last_name': LastName, 'email':email, 'password': randomPassword};
    const url =  `'http://{getcurrentLocation}/home/employee-signup/'`;
    postData(url, data, csrfToken)
    .then(response => {
        if (response == 200) {
           checkUserType();
        }else{
            showSignupError(errorField ,response);
        }
    })
};

//create employer
const createEmployer =()=>{
    let errorField = document.querySelector('[employer-signup-form] #error-message')
    let csrfToken = document.cookie.split(';')[0].split('=')[1];
    let email = document.querySelector('[signup-form] #employer_email_address').value;
    let firstName = document.querySelector('[signup-form] #employer_first_name').value;
    let LastName = document.querySelector('[signup-form] #employer_last_name').value;
    let password = document.querySelector('[signup-form] #raw_password').value;
    let data = {'first_name':firstName, 'last_name': LastName, 'email':email, 'password': password};
    const url =  `'http://{getcurrentLocation}/home/employer-signup/'`;
    postData(url, data, csrfToken)
    .then(response => {
        if(response==200){
           checkUserType();
        }else{
            showSignupError(errorField, response);

        }
    })
};

//showSignupError
const showSignupError =(errorField, error)=>{
    errorField.textContent = error;
    
};

//waiting for page to reload

//is loged out
const logout =()=>{
    const url =  `'http://{getcurrentLocation}/home/logout/'`;
    return fetch(url,{
        method: 'GET',
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        }),
        data: {}
    })
    .then(response => {
        onLogout(response);
    })
    .catch(err => console.log(err));

};

//login data
const login = () => {
    let csrfToken = document.cookie.split(';')[0].split('=')[1];
    let email = document.querySelector('[login] #login_email').value;
    let password = document.querySelector('[login] #login_password').value;
    let data = {'email':email, 'password':password};

    //error
    const errorField = document.querySelector('[login-container] #error-message');
    

    const url = `'http://{getcurrentLocation}/home/login/'`;
    postData(url, data, csrfToken)
    .then(response => {
        if(response==200){
            onLogin(JSON.parse(response)); // JSON-string from `response.json()` call
            checkUserType();
            console.log(response);
            return true;
        }else{
            showSignupError(errorField, response);
            return false;    
        }         
    })     
    .catch(error => console.error(error));    
    };
    


// post request
const postData = (url, data, csrfToken) =>{
    return fetch(url, {
        method: 'POST',
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: new Headers({
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
        }),
        dataType: 'json',
        body: JSON.stringify(data)

    }) 
    
    .then(response => response.json())
    };

//check the type of user logged in
const checkUserType =()=>{
    const isEmployer = document.querySelector('[logged-in-is_employer]').textContent;
    console.log(isEmployer);
    if (isEmployer == 'False'){
        document.querySelector('[employer-data]').style.display = 'none';
        document.querySelector('[employee-data]').style.display = 'block';
        document.querySelector('[add-employee-button]').style.display = 'none';
        isLogedIn();
        return false;
    } else if(isEmployer == 'True') {
        document.querySelector('[employer-data]').style.display = 'block';
        document.querySelector('[employee-data]').style.display = 'none';
        isLogedIn();
        return true;
    } else if(isEmployer == ''){
        isLogedOut();
        document.querySelector("[loader]").style.display = "none";
        return false;
    }

};

//is the user logged in?
const isLogedIn = ()=>{
    //let user = JSON.parse(localStorage.getItem('user')); 
    let userId = document.querySelector('[logged-in-user-id').textContent;    
    console.log('isLogedIn');
    console.log(userId);
    saveUserToLocalStorage();
    setTimeout(loader, 700);
    return true;
};

//is logged out
const isLogedOut =()=>{   
    removeUserFromLocalStorage();
    showLoginModal();
    return true; 
};

//on login
const onLogin = (data) =>{
        console.log(data);
        location.reload();        
        return true; 
};

//on login
const onLogout = (data) =>{
    console.log(data);
    location.reload(); 
    return true; 
};

//show login
const showLoginModal =()=>{
    document.querySelector('[login-container').style.display = 'block';
    hideAddEmployeeForm();
    hideAdminNav();
    hideAssetsContainer();
    hideEmployeeDetails();
    hideEmployerDataCont();
    hideEmployerSignup();
};

//remove login
const hideLoginModal =()=>{
    document.querySelector('[login-container').style.display = 'none';    
};

//employer sign up
const showEmployerSignup =()=>{
    document.querySelector('[employer-signup-form]').style.display = 'block';
    hideAddEmployeeForm();
    hideAdminNav();
    hideAssetsContainer();
    hideEmployeeDetails();
    hideEmployerDataCont();
    hideLoginModal();
};

//home view
const homeView =()=>{
    showAdminNav();
    showEmployerDataCont();
};

//hide employer sign up
const hideEmployerSignup =()=>{
    document.querySelector('[employer-signup-form]').style.display = 'none';
};

//show assets container
const showAssetsContainer =()=>{
    document.querySelector('[assets-all-container]').style.display ='block';
    fadeAdminNav();
    fadeEmployerData();
};

//hide assets container
const hideAssetsContainer =()=>{
    document.querySelector('[assets-all-container]').style.display ='none';
};

//show employer data container
const showEmployerDataCont =()=>{
    document.querySelector('[employer-data]').style.display ='block';
};

//hide employer data container
const hideEmployerDataCont =()=>{
    document.querySelector('[employer-data]').style.display ='none';
};

//fade employer data container
const fadeEmployerData= () =>{
    document.querySelector('[employer-data]').style.opacity ='.3';
};

//show add-employee modal
const showAddEmployeeForm =()=>{
    document.querySelector('[add-employee-modal]').style.display ='block';
    fadeAdminNav();
    fadeEmployerData();
};

//const hide add-employee modal
const hideAddEmployeeForm =()=>{
    document.querySelector('[add-employee-modal]').style.display ='none';
};

//show admin nav container
const showAdminNav =()=>{
    document.querySelector('[admin-nav]').style.display ='block';
};

//hide admin nav container
const hideAdminNav =()=>{
    document.querySelector('[admin-nav]').style.display ='none';
};

//fade admin nav container
const fadeAdminNav =()=>{
    document.querySelector('[admin-nav]').style.opacity ='.3';
};


//show employee details container
const showEmployeeDetails =()=>{    
    document.querySelector('[employee-details]').style.display ='block';
    fadeAdminNav();
    fadeEmployerData();
};

//hide employee details container
const hideEmployeeDetails =()=>{    
    document.querySelector('[employee-details]').style.display ='none';
};

//save user to local storage
const saveUserToLocalStorage = () =>{
    const userId = document.querySelector('span[logged-in-user-id]').textContent;
    localStorage.setItem('user', JSON.stringify(userId));
};

//delete user from local storage
const removeUserFromLocalStorage =()=>{
    localStorage.removeItem('user');
};

//get user from local storage
const getUserFromLocalStorage = () =>{
    let user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    return user;
};

//close button event
const closeBtnEvent =()=>{
    hideAddEmployeeForm();
    hideAssetsContainer();
    hideEmployeeDetails();
    hideEmployerSignup();
    isLogedIn();
    location.reload();
};

// add event listeners
const addEventListeners = () =>{
    const closeBtn = document.querySelectorAll('.close-btn');
    const loginBtn = document.querySelector('[login-button]');
    const submitEmployeeBtn = document.querySelector('[submit-add-employee-button]');
    const submitEmployerBtn= document.querySelector('[submit-add-employer-button]');
    const viewAllAssetsBtn = document.querySelector('[view-all-assets-button]');
    const showEmployeeDetailsBtn = document.querySelectorAll('[view-more-button]');
    const navLogoutBtn = document.querySelector('[nav-bar-logout-button]');
    const showEmployerSignUpBtn = document.querySelector('[signup-button]');
    const addEmployeeButton = document.querySelector('[add-employee-button]');
    const viewEmployeeAssets = document.querySelector('[view-assets-button]');

    viewEmployeeAssets.addEventListener('click', getEmployeeAssets)
    addEmployeeButton.addEventListener('click', showAddEmployeeForm);
    loginBtn.addEventListener('click', login);
    navLogoutBtn.addEventListener('click', logout);
    showEmployerSignUpBtn.addEventListener('click', showEmployerSignup)
    submitEmployeeBtn.addEventListener('click', createEmployee);
    submitEmployerBtn.addEventListener('click', createEmployer)
    viewAllAssetsBtn.addEventListener('click', showAssetsContainer);

    closeBtn.forEach(element => {
        return element.addEventListener('click', closeBtnEvent);
        
    });
    showEmployeeDetailsBtn.forEach(element =>{
        element.addEventListener('click', getEmployeeData);
    });
};

//generate random password
const randomPass =(length)=> {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
   
};

//loader content
const loader =()=>{
    document.querySelector("[loader]").style.display = "none";
    document.querySelector("[profile-container]").style.display = "block";
};

//statr app
startApp = () =>{    
    checkUserType();
    addEventListeners();
};
startApp();


