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

btnLogout.addEventListener('click', ()=>{
    localStorage.removeItem("loggedUser");

    window.location.href = "./index.html"
})

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

        formUpdateNote.addEventListener('submit', (e)=>{
            e.preventDefault()
            editNote(note)
        })
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

function editNote(note){
    
    if(!formUpdateNote.checkValidity()){
        formUpdateNote.classList.add("was-validated");
        return;
    }

    note.title = titleUpdate.value
    note.description = descriptionUpdate.value
    
    const cardTitle = document.querySelector(`#note-${note.id} .card-header`)
    cardTitle.innerText = titleUpdate.value

    const cardDescription =document.querySelector(`#note-${note.id} .card-text`)
    cardDescription.innerText = descriptionUpdate.value

    updateLocalStorage()
    formUpdateNote.reset()
    formUpdateNote.classList.remove('was-validated')
    modalEdit.hide()
}

function deleteNote(id){
   const index = loggedUser.notes.findIndex((note) => note.id === id)
   loggedUser.notes.splice(index, 1)
   
   const divNote = document.getElementById(`note-${id}`)
   modalDelete.hide()
   divNote.remove()

   changeHeader()
   updateLocalStorage()
}

function createdAt(){
    const date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    return `${day}/${month}/${year}`
}

function changeHeader(){
    const title = document.getElementById('title')
    const p = document.getElementById('totalRecados')

    title.innerText = `Olá, ${loggedUser.username} 👋!`
    p.innerText = `Total de tarefas: ${loggedUser.notes.length}`
}

function updateLocalStorage(){
    let index = users.findIndex((user)=> user.email === loggedUser.email)
    users.splice(index,1,loggedUser)

    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    localStorage.setItem("users", JSON.stringify(users));
}



