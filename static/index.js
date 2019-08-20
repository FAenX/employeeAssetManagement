// getEmployeeId
const getEmployeeId = () =>{
    let target = event.target;
    let employeeId = target.parentNode.childNodes[5].innerText;
    let data = {'employee_id':employeeId}
    let csrfToken = target.parentNode.childNodes[7].value;
    let url = 'http://127.0.0.1:8000/home/employee-API/';
    postData(url, data, csrfToken)
    .then(data => popEmployee(JSON.parse(data))) // JSON-string from `response.json()` call
    .catch(error => console.error(error));
    //console.log(employeeData);
    
};

//pop employee details modal
const popEmployee = (employeeData) =>{
    const parentNode = document.querySelector('[employee-details]');

    console.log(employeeData[0]['fields']);
    
    document.querySelector('[personal-details] #full-name').innerText = `${employeeData[0]['fields']['first_name']} ${employeeData[0]['fields']['last_name']}`;
    document.querySelector('[personal-details] #email-address').innerText = `${employeeData[0]['fields']['email']}`;
    document.querySelector('[personal-details] #contact-number').innerText= `${employeeData[0]['fields']['contact_number']}`;
    document.querySelector('[personal-details] #kra-pin').innerText= `${employeeData[0]['fields']['kra_pin']}`;
    document.querySelector('[personal-details] #date-joined').innerText= `${employeeData[0]['fields']['date_joined']}`;
    document.querySelector('[personal-details] #date-of-birth').innerText = `${employeeData[0]['fields']['date_of_birth']}`;
    document.querySelector('[personal-details] #id-number').innerText= `${employeeData[0]['fields']['id_number']}`;
    console.log(document.querySelector('[personal-details] #full-name'));
    parentNode.style.display = 'block';
    fadeBackground();
    
};

//fade background on modal popup
const fadeBackground = () =>{
    const employerData = document.querySelector('[employer-data]');
    const adminNav = document.querySelector('[admin-nav]');

    employerData.style.opacity ='.3';
    adminNav.style.opacity='.3'

};

//view all assets
const showAssets =()=>{
    const assetsAll = document.querySelector('[assets-all-container]');  

    assetsAll.style.display='inline-block';
    fadeBackground();
    
};

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
const showHideDivs =()=>{
    const toHide = document.querySelector('[employer-data]');
    const toShow = document.querySelector('[add-employee-form]');
    toShow.style.display='block';  
    toHide.style.opacity='.3';
};

//hide div given field
const hideShowDivs =()=>{
    const toHide = document.querySelector('[add-employee-form]');
    const toShow = document.querySelector('[employer-data]');
    toShow.style.display='block';  
    toHide.style.display='none';
};


//sign up data
const createEmployee =()=>{
    let csrfToken = document.querySelector('[create-employee-form] input:nth-child(1)').value;
    let email = document.querySelector('[create-employee-form] #email_address').value;
    let firstName = document.querySelector('[create-employee-form] #first_name').value;
    let LastName = document.querySelector('[create-employee-form] #last_name').value;
    let password = document.querySelector('[create-employee-form] #raw_password').value;
    let user = document.querySelector('[create-employee-form] #user').value;


    let data = {'first_name':firstName, 'last_name': LastName, 'email':email, 'password':password};
    const url = 'http://127.0.0.1:8000/home/signup/';
    postData(url, data, csrfToken);
    console.log(data); 

};

//login data
const login = () => {
    let csrfToken = document.querySelector('[login] input:nth-child(1)').value;
    let email = document.querySelector('[login] input:nth-child(2)').value;
    let password = document.querySelector('[login] input:nth-child(3)').value;
    let data = {'email':email, 'password':password};

    const url = 'http://127.0.0.1:8000/home/login/';
    postData(url, data, csrfToken);
    console.log(data);
    };

// login
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

//handle get requests
const getData = (url, data)=>{
    

};

// start app
const closeBtn = document.querySelectorAll('.close-btn');
const loginBtn = document.querySelector('[login-button]');
const addEmpBtn = document.querySelector('[add-employee-button]');
const createEmployeeBtn = document.querySelector('[create-employee-button]');
const viewAllAssetsBtn = document.querySelector('[view-all-assets]');
const employeeDiv = document.querySelectorAll('[view-more]');
//const employeeField = document.querySelector('[employee-info] .user-info .u-info');
//console.log(employeeDiv);


addEmpBtn.addEventListener('click', showHideDivs);
//loginBtn.addEventListener('click', login);
createEmployeeBtn.addEventListener('click', createEmployee);
viewAllAssetsBtn.addEventListener('click', showAssets);

closeBtn.forEach(element => {
    return element.addEventListener('click', closeModal);
    
});
employeeDiv.forEach(element =>{
    element.addEventListener('click', getEmployeeId);
});



