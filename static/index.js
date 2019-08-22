// getEmployeeId
const getEmployeeId = () =>{
    let target = event.target;
    let employeeId = target.parentNode.childNodes[3].innerText;
    let data = {'employee_id':employeeId}
    let csrfToken = target.parentNode.childNodes[5].value;
    let url = 'http://127.0.0.1:8000/home/employeeApi/';
    postData(url, data, csrfToken)
    .then(data => popEmployee(JSON.parse(data))) // JSON-string from `response.json()` call
    .catch(error => console.error(error));
    //console.log(employeeData);    
};

//pop employee details modal
const popEmployee = (employeeData) =>{
    const parentNode = document.querySelector('[employee-details]');
    console.log(employeeData[0]['fields']);    
    document.querySelector('[personal-details] #full-name').innerText = `Full Name: ${employeeData[0]['fields']['first_name']} ${employeeData[0]['fields']['last_name']}`;
    document.querySelector('[personal-details] #email-address').innerText = `Email Address: ${employeeData[0]['fields']['email']}`;
    document.querySelector('[personal-details] #contact-number').innerText= `Phone Number: ${employeeData[0]['fields']['contact_number']}`;
    document.querySelector('[personal-details] #kra-pin').innerText= `KRA-pin: ${employeeData[0]['fields']['kra_pin']}`;
    document.querySelector('[personal-details] #date-joined').innerText= `Date Joined: ${employeeData[0]['fields']['date_joined']}`;
    document.querySelector('[personal-details] #date-of-birth').innerText = `D.O.B: ${employeeData[0]['fields']['date_of_birth']}`;
    document.querySelector('[personal-details] #id-number').innerText= `ID-Number: ${employeeData[0]['fields']['id_number']}`;
    console.log(document.querySelector('[personal-details] #full-name'));
    parentNode.style.display = 'block';
    fadeBackground();    
};

//fade background on modal popup
const fadeBackground = () =>{
    const employerData = document.querySelector('[employer-data]');
    const adminNav = document.querySelector('[admin-nav]');
    employerData.style.opacity ='.3';
    adminNav.style.opacity='.3';
};

//view all assets
const showAssets =()=>{
    const assetsAll = document.querySelector('[assets-all-container]');  
    assetsAll.style.display='inline-block';
    fadeBackground();    
};

//close modals
const closeModal = ()=>{
    const assetsAll = document.querySelector('[assets-all-container]');
    const employerData = document.querySelector('[employer-data]');
    const form = document.querySelector('[add-employee-form]');
    const adminNav = document.querySelector('[admin-nav]');
    const employeeDetails=document.querySelector('[employee-details]');
    employerData.style.opacity ='1';
    adminNav.style.opacity='1'
    assetsAll.style.display='none';
    employerData.style.display = 'block';
    form.style.display = 'none';
    employeeDetails.style.display = 'none';
};

//hide div given field
const addEmployee =()=>{
    const parentNode = document.querySelector('[add-employee-form]');
    parentNode.style.display='block';  
    fadeBackground();
};

//sign up data
const createEmployee =()=>{
    let csrfToken = document.querySelector('[create-employee-form] input:nth-child(1)').value;
    let email = document.querySelector('[create-employee-form] #email_address').value;
    let firstName = document.querySelector('[create-employee-form] #first_name').value;
    let LastName = document.querySelector('[create-employee-form] #last_name').value;
    let user = document.querySelector('[create-employee-form] #user').value;
    let data = {'first_name':firstName, 'last_name': LastName, 'email':email, 'created_by': user};
    const url = 'http://127.0.0.1:8000/home/signup/';
    postData(url, data, csrfToken);
    console.log(data); 
};

//is loged out
const logout =()=>{
    const url = 'http://127.0.0.1:8000/home/logout/';
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
    .then(response => console.log(response))
    .catch(err => console.log(err));

};

//login data
const login = () => {
    let csrfToken = document.querySelector('[login] input:nth-child(1)').value;
    let email = document.querySelector('[login] input:nth-child(2)').value;
    let password = document.querySelector('[login] input:nth-child(3)').value;
    let data = {'email':email, 'password':password};

    const url = 'http://127.0.0.1:8000/home/login/';
    postData(url, data, csrfToken)
    .then(data => onLogin(JSON.parse(data))) // JSON-string from `response.json()` call
    .then(data => {
        onLogin(data)  
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


//is the user logged in?
const isLogedIn = ()=>{
    //let user = JSON.parse(localStorage.getItem('user')); 
    let userId = document.querySelector('[logged-in-user-id').textContent;
    if (userId != 'None'){
        console.log('isLogedIn');
        console.log(userId);
        saveUserToLocalStorage();
        removeLoginModal(); 
        return true;

    }else{
        console.log(userId);
        removeUserFromLocalStorage();
        showLoginModal();
        return false;
    }  

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
    let loginField = document.querySelector('[login-container');
    loginField.style.display = 'block';
    clearBackground();
};



//remove login
const removeLoginModal =()=>{
    let loginField = document.querySelector('[login-container');
    loginField.style.display = 'none';
    restoreBackground();
};

//clear background
const clearBackground =()=>{
    document.querySelector('[assets-all-container]').style.display ='none';
    document.querySelector('[employer-data]').style.display ='none';
    document.querySelector('[add-employee-form]').style.display ='none';
    document.querySelector('[admin-nav]').style.display ='none';
    document.querySelector('[employee-details]').style.display ='none';
};

//restore background
const restoreBackground =()=>{
    document.querySelector('[employer-data]').style.display ='block';
    document.querySelector('[admin-nav]').style.display ='block';
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

// add event listeners
const addEventListeners = () =>{
    const closeBtn = document.querySelectorAll('.close-btn');
    const loginBtn = document.querySelector('[login-button]');
    const addEmpBtn = document.querySelector('[add-employee-button]');
    const createEmployeeBtn = document.querySelector('[create-employee-button]');
    const viewAllAssetsBtn = document.querySelector('[view-all-assets]');
    const employeeDiv = document.querySelectorAll('[view-more]');
    const navLogout = document.querySelector('[nav-bar-logout]');

    addEmpBtn.addEventListener('click', addEmployee);
    loginBtn.addEventListener('click', login);
    navLogout.addEventListener('click', logout);
    createEmployeeBtn.addEventListener('click', createEmployee);
    viewAllAssetsBtn.addEventListener('click', showAssets);

    closeBtn.forEach(element => {
        return element.addEventListener('click', closeModal);
        
    });
    employeeDiv.forEach(element =>{
        element.addEventListener('click', getEmployeeId);
    });
};


//statr app
startApp = () =>{    
    isLogedIn();
    addEventListeners();
};
startApp();