//hide div given field
const showHideDivs =()=>{
    const toHide = document.querySelector('[employer-data]');
    const toShow = document.querySelector('[add-employee-form]');
    toShow.style.display='block';  
    toHide.style.display='none';
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
    fetch(url, {
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
    .then(data => {
    console.log(data) // Prints result from `response.json()` in getRequest
    })
    .catch(error => console.error(error));
    };



    

// start app
closeCreateUser = document.querySelector('[close-btn]');
loginBtn = document.querySelector('[login-button]');
addEmpBtn = document.querySelector('[add-employee-button]');
createEmployeeBtn = document.querySelector('[create-employee-button]');


addEmpBtn.addEventListener('click', showHideDivs);
//loginBtn.addEventListener('click', login);
createEmployeeBtn.addEventListener('click', createEmployee);
closeCreateUser.addEventListener('click', hideShowDivs);

