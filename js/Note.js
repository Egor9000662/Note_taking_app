import { DnD } from './DnD'
class Note {
    data = JSON.parse(localStorage.getItem('data')) || []
    editNoteClass = 'card_edit'
    DnD = DnD
    constructor(wrapSelector = null, buttonSelector = null) {
        this.wrapElement = document.querySelector(wrapSelector) || document.body
        this.buttonElmenent = document.querySelector(buttonSelector)
        this.btnClear = document.querySelector('.nav__buttons--close')
        this.init()
    }
    hendelbeforeunload() {
        localStorage.setItem('data', JSON.stringify(this.data))

    }

    init() {
        if (!this.buttonElmenent) {
            const error = new Error("Вы не указали кнопку")
            console.error(error)
            return
        }
        this.ListenHendlers()
        if (this.data.length) {
            this.render()
        }
    }
    ListenHendlers() {
        this.buttonElmenent.addEventListener('click', this.hendleClickButtoncreateNote.bind(this))
        document.addEventListener('dblclick', this.handleDobleclick.bind(this))
        document.addEventListener('click', this.handelClickButtonSubmit.bind(this))
        addEventListener('beforeunload', this.hendelbeforeunload.bind(this))
        this.btnClear.addEventListener('click', () => {
            this.data.length = 0
            this.render()
        })
        document.addEventListener('click', this.handleBtnClickdeleteElement.bind(this))

    }
    hendleClickButtoncreateNote() {
        this.createNote()
        console.log(this.data)
        this.render()
    }
    handleDobleclick(event) {
        const { target } = event
        const cardElement = target.closest('.card')
        if (cardElement) {
            cardElement.classList.add(this.editNoteClass)
        }
    }
    handelClickButtonSubmit(event) {
        event.preventDefault()
        const { target } = event
        if (target.getAttribute('type') == 'submit') {
            const textareaElement = target.previousElementSibling
            const cardElement = target.closest('.card')
            const { id } = cardElement.dataset
            const index = this.getindexSelectNote(id)
            this.data[index].content = textareaElement.value
            this.render()
        }
    }
    createNote() {
        const noteData = {
            id: new Date().getTime(),
            content: '',
            position: {
                left: 'auto',
                top: 'auto'
            }
        }
        this.data.push(noteData)
    }
    bildNoteElement(noteData) {
        const { id, content, position } = noteData
        const dndWrapElement = document.createElement('div')
        this.setPosition(position, dndWrapElement)
        dndWrapElement.classList.add('dnd')
        new this.DnD(dndWrapElement)
        dndWrapElement.addEventListener('dnd:end', (event) => {
            const { position } = event.detail
            const index = this.getindexSelectNote(id)
            this.data[index].position = position
            this.setPosition(position, dndWrapElement)

        })
        const template = `
        <div data-id="${id}" class="card">
            <div class="card__top">
                <div class="card__name">Card</div>
                <button type="button" class="card__btn--delete">&times;</button>
            </div>
               <div><i class="bi bi-plus-square-fill"></i></div>
            <div class="card__main">
                <div class="card__content">${content}</div>
                <form class="card__form mt-2">
                    <textarea class="w-100" rows="4">${content}</textarea>
                    
                    <button type="submit" class="btn btn-sm btn-dark submit-form">Save</button>
                    
            </form>
           
            </div>
            
        </div>
      `

        dndWrapElement.innerHTML = template
        return dndWrapElement
    }

    handleBtnClickdeleteElement(event) {
        const { target } = event
        if (target.getAttribute('type') == 'button') {
            const cardElement = target.closest('.card')
            const { id } = cardElement.dataset
            this.data.forEach((item, i) => {
                if (item.id == id) {
                    this.data.splice(i, 1)

                    this.render()
                }

            }

            )
        }
    }

    getindexSelectNote(id) {
        let index = 0
        this.data.forEach((item, i) => {
            if (item.id == id) {
                index = i
            }
        })
        return index
    }
    setPosition({ left, top }, element) {
        element.style.left = left
        element.style.top = top
    }
    render() {
        this.wrapElement.innerHTML = ''
        this.data.forEach((item) => {
            const noteElement = this.bildNoteElement(item)
            this.wrapElement.append(noteElement)
        })

    }

}

export { Note }