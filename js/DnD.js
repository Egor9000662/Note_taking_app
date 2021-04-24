class DnD {
    shifts = {
        x: 0,
        y: 0
    }
    constructor(element) {
        this.element = element
        this.position = {
            left: this.element.style.left,
            top: this.element.style.top
        }
        this.hendleMousemoves = this.hendleMousemove.bind(this)
        this.init()
    }
    init() {
        this.element.addEventListener('mousedown', (event) => {
            this.hendleMousedown(event)
        })
        this.element.addEventListener('mouseup', this.hendleMouseup.bind(this))
    }
    hendleMousedown(event) {
        const { clientX, clientY } = event

        this.calcShifts({ clientX, clientY })
        document.addEventListener('mousemove', this.hendleMousemoves)

    }
    hendleMousemove(event) {
        const { clientX, clientY } = event
        this.setPosition({ clientX, clientY })

    }
    calcShifts(coords) {
        const { clientX, clientY } = coords
        const rect = this.element.getBoundingClientRect()
        this.shifts.x = clientX - rect.left
        this.shifts.y = clientY - rect.top
    }
    hendleMouseup() {
        document.removeEventListener('mousemove', this.hendleMousemoves)
        const customEvent = new CustomEvent('dnd:end', {
            detail: { position: this.position }
        })
        this.element.dispatchEvent(customEvent)
    }
    setPosition(coords) {
        const { clientX, clientY } = coords
        const { x: shiftX, y: shiftY } = this.shifts
        this.position = {
            left: clientX - shiftX + 'px',
            top: clientY - shiftY + 'px'
        }
        this.element.style.left = this.position.left
        this.element.style.top = this.position.top
    }
}
export { DnD }