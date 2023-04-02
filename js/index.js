//Form de Login
const formLogin = document.getElementById('login-form')

//Form de cadastro
const formSignUp = document.getElementById('signup-form')
const modal = new bootstrap.Modal('#modal-signup')

const newUsername = formSignUp.name;
let validName = false

const newEmail = formSignUp.newEmail;
let validEmail = false

const newPassword = formSignUp.password;
let validPassword= false

const password2 = formSignUp.password2;
let validPassword2= false


// Lista de usuários 
let users = JSON.parse(localStorage.getItem("users")) ?? [];

// Verificação dos campos de input
newUsername.addEventListener('keyup', ()=>{
   const label = document.getElementById('name-label')

    if(newUsername.value.length < 3){
        label.innerText = "Insira no mínimo 3 caracteres"
        label.setAttribute('style', 'color: #F22E9A')
        validName = false
    }else{
        label.innerText = 'Nome';
        label.setAttribute('style', 'color: black')
        validName = true
    }
})

newEmail.addEventListener('keyup', ()=>{
    const label = document.getElementById('email-label')

    if(!newEmail.value.includes("@" && '.com')){
        label.innerText = "Por favor digite um email válido"
        label.setAttribute('style', 'color: #F22E9A')
        validEmail = false
    }else{
        label.innerText = 'Email';
        label.setAttribute('style', 'color: black')
        validEmail = true
    }

})

newPassword.addEventListener('keyup', ()=>{
    const label = document.getElementById('password-label')

    if(newPassword.value.length < 5 ){
        label.innerText = "Insira mínimo 5 caracteres"
        label.setAttribute('style', 'color: #F22E9A')
        validPassword = false
    }else{
        label.innerText = 'Senha';
        label.setAttribute('style', 'color: black')
        validPassword = true
    }

})

password2.addEventListener('keyup', ()=>{
    const label = document.getElementById('password2-label')

    if(password2.value != newPassword.value ){
        label.innerText = "As senhas não conferem"
        label.setAttribute('style', 'color: #F22E9A')
        validPassword2 = false
    }else{
        label.innerText = 'Confirme sua Senha';
        label.setAttribute('style', 'color: black')
        validPassword2 = true
    }
})


//Função para cadastro
formSignUp.addEventListener('submit', (e)=>{
    e.preventDefault()

    if(validName && validEmail && validPassword && validPassword2){
        let emailExists = verifyEmail()

        if(emailExists){
            return
        }  
    }

    users.push({
        username: newUsername.value,
        email: newEmail.value,
        password: newPassword.value,
    })

    localStorage.setItem("users", JSON.stringify(users))
    formSignUp.reset()
    modal.hide()
    showAlert('success', 'Conta criada com sucesso! ✅')
})

//Verifica se o email já existe durante o cadastro
function verifyEmail(){
   const divAlert = document.getElementById('alert')
   let emailExists = users.some((user)=> user.email === newEmail.value )
    
   if(emailExists){
   const alert = `
   <div>
        <div class='alert alert-danger alert-dismissible ' role='alert'>
        <div> Email já está sendo utilizado</div>
        <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
        </div>
    </div>
   `
    divAlert.innerHTML = alert
    return true
   }
   return false
}

//Função para Login
formLogin.addEventListener('submit', (e)=>{
    e.preventDefault()

    const loggedUser = verifyUser()

    if(!loggedUser){
        return
    }

    localStorage.setItem("loggedUser", JSON.stringify(loggedUser))
    window.location.href = './dashboard.html'
})

//verifica o usuário
function verifyUser(){
    const user = users.find((user) => user.email === formLogin.email.value)

    if(!user){
        showAlert('danger', 'Usuário não cadastrado ❌')
        return
    }

    if(user.password !== formLogin.password.value){
        showAlert('danger', 'Senha incorreta ❌')
        return
    }

    const foundUser = user
    foundUser.notes = user.notes ?? []
    return foundUser
}

function showAlert(mode, message){
    const divToast = document.getElementById('toast')

    const toast = document.createElement('div')
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', "assertive")
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('class', 'bounce-top toast align-items-center position-absolute top-0 end-0 m-2 me-2 border-0 show')
    toast.classList.add(`text-bg-${mode}`)
  
    const content = document.createElement('div');
    content.classList.add('d-flex')
  
    const toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.innerText = `${message}`
  
    const btn = document.createElement('button')
    btn.setAttribute('type', 'button')
    btn.setAttribute('class', 'btn-close btn-close-white me-2 m-auto')
    btn.setAttribute('data-bs-dismiss', 'toast')
    btn.setAttribute('aria-label', 'Close')
  
    content.appendChild(toastBody)
    content.appendChild(btn)
    toast.appendChild(content)
  
    divToast.appendChild(toast)
  
    setTimeout(()=>{
      toast.remove()
    }, 6000)

}
