import './style.css'

const canvas = document.querySelector('canvas')
const context = canvas?.getContext("2d")
const toolButtons = document.querySelectorAll<HTMLLIElement>('.tool')
const fillColor = document.querySelector<HTMLInputElement>('#fill-color')
const sizeSlider = document.querySelector<HTMLInputElement>('#size-slider')
const colorButtons = document.querySelectorAll<HTMLLIElement>('.colors .option')
const colorPicker = document.querySelector<HTMLInputElement>('#color-picker')
const clearcanvasButton = document.querySelector<HTMLButtonElement>('.clear-canvas')
const saveImageButton = document.querySelector<HTMLButtonElement>('.save-img')

let isDrawing = false
let selectedTool: SelectdTool = "brush"
let brusWidth = 5;
let previousMouseX: number
let previousMouseY: number
let snpashot: ImageData
let selectedColor = "#000"

function setCanvasBackground() {
  context!.fillStyle = '#fff';
  context?.fillRect(0, 0, canvas!.width, canvas!.height)
  context!.fillStyle = selectedColor
}

window.addEventListener('load', () => {
  if (canvas) {
    setTimeout(() => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      setCanvasBackground()
    }, 300)
  }
})

function startDraw(event: MouseEvent) {
  isDrawing = true;
  previousMouseX = event.offsetX
  previousMouseY = event.offsetY
  context?.beginPath()
  context!.strokeStyle = selectedColor
  context!.fillStyle = selectedColor
  context!.lineWidth = brusWidth
  snpashot = context!.getImageData(0, 0, canvas!.width, canvas!.height)
}

function stopDraw() {
  isDrawing = false
}

function drawRect(event: MouseEvent) {
  const w = previousMouseX - event.offsetX
  const h = previousMouseY - event.offsetY

  if (!fillColor?.checked) {
    context?.strokeRect(event.offsetX, event.offsetY, w, h)
    return
  }

  context?.fillRect(event.offsetX, event.offsetY, w, h)
  return
}

function drawRCircle(event: MouseEvent) {
  const w = Math.pow((previousMouseX - event.offsetX), 2)
  const h = Math.pow((previousMouseY - event.offsetY), 2)

  const radius = Math.sqrt(w + h)
  const startAngle = 0
  const endAngle = 2 * Math.PI

  context?.beginPath()

  context?.arc(previousMouseX, previousMouseY, radius, startAngle, endAngle)
  context?.stroke()

  fillColor?.checked ? context?.fill() : context?.stroke()
}

function drawTriangle(event: MouseEvent) {
  const a = previousMouseX * 2 - event.offsetX

  context?.beginPath()
  context?.moveTo(previousMouseX, previousMouseY)
  context?.lineTo(event.offsetX, event.offsetY)
  context?.lineTo(a, event.offsetY)
  context?.closePath()

  fillColor?.checked ? context?.fill() : context?.stroke()
}

function drawLine(event: MouseEvent) {
  context?.beginPath()
  context?.moveTo(previousMouseX, previousMouseY)
  context?.lineTo(event.offsetX, event.offsetY)
  context?.stroke()
}

function drawBrush(event: MouseEvent) {
  context?.lineTo(event.offsetX, event.offsetY)
  context?.stroke()
}

function eraser(event: MouseEvent) {
  context?.lineTo(event.offsetX, event.offsetY)
  context!.strokeStyle = '#fff'
  context?.stroke()
}


function drawing(event: MouseEvent) {
  if (!isDrawing) return

  context?.putImageData(snpashot, 0, 0)

  switch (selectedTool) {
    case 'rectangle':
      drawRect(event)
      break;
    case 'circle':
      drawRCircle(event)
      break;
    case 'triangle':
      drawTriangle(event)
      break;
    case 'line':
      drawLine(event)
      break;
    case 'brush':
      drawBrush(event)
      break;
    case 'eraser':
      eraser(event)
      break;
    default: return
  }
}

for (const button of toolButtons) {
  button.addEventListener('click', () => {
    document.querySelector(".options .active")?.classList.remove("active")
    button.classList.add("active")
    selectedTool = button.id as SelectdTool
  })
}

for (const button of colorButtons) {
  button.addEventListener('click', () => {
    document.querySelector(".options .selected")?.classList.remove("selected")
    button.classList.add("selected")

    selectedColor = window.getComputedStyle(button).getPropertyValue("background-color")
  })
}

sizeSlider?.addEventListener('change', () => brusWidth = parseInt(sizeSlider.value, 10))

colorPicker?.addEventListener('input', () => {
  colorPicker.parentElement!.style.background = colorPicker.value
  colorPicker.parentElement!.click()

  colorPicker.select()
  selectedColor = colorPicker.value
})

clearcanvasButton?.addEventListener('click', () => {
  context?.clearRect(0, 0, canvas!.width, canvas!.height)
})

saveImageButton?.addEventListener('click', () => {
  const link = document.createElement('a')
  link.href = canvas!.toDataURL()
  link.download = `${Date.now()}.jpg`
  link.click()
})

canvas?.addEventListener('mousedown', startDraw)
canvas?.addEventListener('mouseup', stopDraw)
canvas?.addEventListener("mousemove", drawing)