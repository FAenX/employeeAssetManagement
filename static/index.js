//hide div given field
const hideLogin =(field)=>{
    field.style.display='none';
};

//show div 
const showDiv = () =>{
    const field = document.querySelector('[add-employee-form]');
    field.style.display='block';   
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


addEmpBtn = document.querySelector('[add-employee-button]');
addEmpBtn.addEventListener('click', showDiv);


