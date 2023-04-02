const loggedUser = JSON.parse(localStorage.getItem("loggedUser"))
const users = JSON.parse(localStorage.getItem("users"))

const formCreateNote = document.getElementById('form-add-note')
const formUpdateNote = document.getElementById('form-edit')

const modalAddNote = new bootstrap.Modal("#modal-add-note")
const modalDelete = new bootstrap.Modal("#modal-delete")
const modalEdit = new bootstrap.Modal("#modal-edit")

const divNotes = document.getElementById("notes")
const titleUpdate = document.getElementById('title-updated')
const descriptionUpdate = document.getElementById('description-updated')
let idUpdate = -1

const btnLogout = document.getElementById('btn-logout')

document.addEventListener('DOMContentLoaded', changeHeader)
document.addEventListener('DOMContentLoaded', ()=>{
    loggedUser.notes.forEach(note => {
        createCard(note)
    });
} )

//Função para cadastro de nova tarefa
formCreateNote.addEventListener('submit',(e)=>{
    e.preventDefault()

    if (!formCreateNote.checkValidity()) {
        formCreateNote.classList.add("was-validated");
        return;
      }
    
    const title = formCreateNote.title.value
    const description = formCreateNote.description.value

    const note = {
    id: new Date().getTime(),
    title : title,
    description : description,
    createdAt : createdAt()
   }

   loggedUser.notes.push(note)
   updateLocalStorage()
   createCard(note)
   formCreateNote.reset()
   formCreateNote.classList.remove('was-validated')
   modalAddNote.hide()
   changeHeader()
})

//Função para editar tarefa
formUpdateNote.addEventListener('submit', (e)=>{
    e.preventDefault()

    if(!formUpdateNote.checkValidity()){
        formUpdateNote.classList.add("was-validated");
        return;
    }

    const indexUpdate = loggedUser.notes.findIndex((note)=> note.id === idUpdate)

    loggedUser.notes[indexUpdate].title = titleUpdate.value
    loggedUser.notes[indexUpdate.description] = descriptionUpdate.value
    
    const cardTitle = document.querySelector(`#note-${idUpdate} .card-header`)
    cardTitle.innerText = titleUpdate.value

    const cardDescription =document.querySelector(`#note-${idUpdate} .card-text`)
    cardDescription.innerText = descriptionUpdate.value

    updateLocalStorage()
    formUpdateNote.reset()
    idUpdate= -1
    formUpdateNote.classList.remove('was-validated')
    modalEdit.hide()
    showAlert("success", "Tarefa atualizada com sucesso! ✅ ")
})

//Função para sair
btnLogout.addEventListener('click', ()=>{
    localStorage.removeItem("loggedUser");

    window.location.href = "./index.html"
})

//Função para criar cards
function createCard(note){
    const col = document.createElement('div')
    col.setAttribute('class', 'col-12 col-sm-6 col-lg-4 col-xl-3')
    col.setAttribute('id', `note-${note.id}`)

    const card = document.createElement('div')
    card.setAttribute('class', 'card')

    const cardHeader = document.createElement('h5')
    cardHeader.setAttribute('class', 'card-header')
    cardHeader.innerText = note.title

    const cardBody = document.createElement('div')
    cardBody.setAttribute('class', 'card-body')

    const cardText = document.createElement('p')
    cardText.setAttribute('class', 'card-text')
    cardText.innerText = note.description

    const divBtn = document.createElement('div')
    divBtn.setAttribute('class', 'text-end mt-2')

    const createdAt = document.createElement('small')
    createdAt.setAttribute('class', 'me-2')
    createdAt.innerText = "Criado em: " + note.createdAt

    const btnEdit = document.createElement('button')
    btnEdit.setAttribute('class', 'btn btn-primary me-1')
    btnEdit.innerHTML = '<i class="bi bi-pencil-square"></i>'
    btnEdit.addEventListener('click', ()=>{
        modalEdit.show()
     
        titleUpdate.value = note.title
        descriptionUpdate.value = note.description

        idUpdate = note.id
    })

    const btnDel = document.createElement('button')
    btnDel.setAttribute('class', 'btn btn-secondary')
    btnDel.innerHTML = '<i class="bi bi-trash3"></i>'
    btnDel.addEventListener('click', ()=>{
        modalDelete.show()
        const btnConfirm = document.getElementById('delete')
        btnConfirm.setAttribute('onclick', `deleteNote(${note.id})`)
    })
    
    divBtn.appendChild(createdAt)
    divBtn.appendChild(btnEdit)
    divBtn.appendChild(btnDel)

    cardBody.appendChild(cardText)
    cardBody.appendChild(divBtn)

    card.appendChild(cardHeader)
    card.appendChild(cardBody)

    col.appendChild(card)

    divNotes.appendChild(col)
}

//Função para deletar tarefa
function deleteNote(id){
   const index = loggedUser.notes.findIndex((note) => note.id === id)
   loggedUser.notes.splice(index, 1)
   
   const divNote = document.getElementById(`note-${id}`)
   modalDelete.hide()
   divNote.remove()

   changeHeader()
   updateLocalStorage()
   showAlert("success", "tarefa deletada com sucesso! ✅")
}

//função para adicionar data de criação
function createdAt(){
    const date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    return `${day}/${month}/${year}`
}

//função para mudar a header
function changeHeader(){
    const title = document.getElementById('title')
    const p = document.getElementById('totalRecados')

    title.innerText = `Olá, ${loggedUser.username} 👋!`
    p.innerText = `Total de tarefas: ${loggedUser.notes.length}`
}

//função para mostrar alerta
function showAlert(mode, message){
    const divToast = document.getElementById('toast')

    const toast = document.createElement('div')
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', "assertive")
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('class', 'bounce-top toast align-items-center mx-1 mt-2 border-0 show')
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

//função para atualizar local storage
function updateLocalStorage(){
    let index = users.findIndex((user)=> user.email === loggedUser.email)
    users.splice(index,1,loggedUser)

    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    localStorage.setItem("users", JSON.stringify(users));
}



