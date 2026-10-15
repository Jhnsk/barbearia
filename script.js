// ===== Configurações da barbearia (edite aqui) =====
const CONFIG = {
  // Número no formato internacional, apenas dígitos (55 + DDD + número)
  whatsappNumber: '5511999999999',
  whatsappDisplay: '(11) 99999-9999',
  address: 'Rua Augusta, 1962 — Consolação, São Paulo/SP',
}

const SERVICES = [
  { name: 'Corte Clássico', description: 'Tesoura e máquina, finalizado com pomada', price: 60, duration: '45 min' },
  { name: 'Barba na Navalha', description: 'Toalha quente, óleo e navalha tradicional', price: 50, duration: '40 min' },
  { name: 'Corte + Barba', description: 'O combo completo do cavalheiro', price: 100, duration: '1h20' },
  { name: 'Pezinho & Acabamento', description: 'Contorno e limpeza entre cortes', price: 25, duration: '15 min' },
  { name: 'Pigmentação de Barba', description: 'Preenchimento natural das falhas', price: 45, duration: '30 min' },
  { name: 'Corte Infantil', description: 'Para os pequenos cavalheiros até 12 anos', price: 45, duration: '30 min' },
]

const BARBERS = [
  { name: 'Seu Antônio', role: 'Mestre Barbeiro', since: 'Desde 1988', image: 'images/barber-1.png' },
  { name: 'Rafael Lima', role: 'Especialista em Fade', since: 'Desde 2016', image: 'images/barber-2.png' },
  { name: 'Carla Souza', role: 'Barba & Navalha', since: 'Desde 2012', image: 'images/barber-3.png' },
]

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

// ===== Funções auxiliares =====
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

function whatsappLink(message) {
  const base = `https://wa.me/${CONFIG.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

function todayISO() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })
}

function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

// ===== Menu móvel =====
const menuToggle = document.getElementById('menu-toggle')
const mobileMenu = document.getElementById('mobile-menu')

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu')
  mobileMenu.hidden = !open
}

menuToggle.addEventListener('click', () => setMenu(mobileMenu.hidden))
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)))

// ===== Links do WhatsApp, mapa e ano =====
document.querySelectorAll('.js-whatsapp').forEach((link) => {
  link.href = whatsappLink(link.dataset.message)
})
document.getElementById('whatsapp-display').textContent = CONFIG.whatsappDisplay
document.getElementById('address').textContent = CONFIG.address
document.getElementById('map-link').href =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.address)}`
document.getElementById('year').textContent = new Date().getFullYear()

// ===== Tabela de serviços =====
const priceList = document.getElementById('price-list')
SERVICES.forEach((service) => {
  const li = el('li')
  const row = el('div', 'price-row')
  row.append(el('h3', '', service.name), el('span', 'dots'), el('span', 'price', currency.format(service.price)))
  const desc = el('p', 'price-desc', `${service.description} · `)
  desc.append(el('span', '', service.duration))
  li.append(row, desc)
  priceList.append(li)
})

// ===== Barbeiros =====
const barbersList = document.getElementById('barbers')
BARBERS.forEach((barber) => {
  const li = el('li', 'barber')
  const photo = el('div', 'barber-photo')
  const img = el('img')
  img.src = barber.image
  img.alt = `Retrato de ${barber.name}, ${barber.role}`
  img.loading = 'lazy'
  photo.append(img)

  const info = el('div', 'barber-info')
  const text = el('div')
  text.append(el('h3', '', barber.name), el('p', 'barber-role', barber.role))
  info.append(text, el('span', 'barber-since', barber.since))

  li.append(photo, info)
  barbersList.append(li)
})

// ===== Formulário de agendamento =====
const form = document.getElementById('booking-form')
const serviceSelect = document.getElementById('service')
const barberSelect = document.getElementById('barber')
const dateInput = document.getElementById('date')
const slotsContainer = document.getElementById('slots')
const errorBox = document.getElementById('form-error')
let selectedTime = ''

SERVICES.forEach((s) => {
  const option = el('option', '', `${s.name} — R$ ${s.price}`)
  option.value = s.name
  serviceSelect.append(option)
})

BARBERS.forEach((b) => {
  const option = el('option', '', b.name)
  option.value = b.name
  barberSelect.append(option)
})

dateInput.min = todayISO()

TIME_SLOTS.forEach((slot) => {
  const button = el('button', 'slot', slot)
  button.type = 'button'
  button.setAttribute('aria-pressed', 'false')
  button.addEventListener('click', () => {
    selectedTime = slot
    slotsContainer.querySelectorAll('.slot').forEach((b) => b.setAttribute('aria-pressed', String(b === button)))
  })
  slotsContainer.append(button)
})

function showError(message) {
  errorBox.textContent = message
  errorBox.hidden = !message
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const data = new FormData(form)
  const name = String(data.get('name') || '').trim()
  const service = String(data.get('service') || '')
  const barber = String(data.get('barber') || '')
  const date = String(data.get('date') || '')
  const notes = String(data.get('notes') || '').trim()

  if (!name || !service || !date || !selectedTime) {
    showError('Preencha nome, serviço, data e horário para continuar.')
    return
  }

  const [y, m, d] = date.split('-').map(Number)
  const weekday = new Date(y, m - 1, d).getDay()
  if (weekday === 0 || weekday === 1) {
    showError('Não abrimos aos domingos e segundas. Escolha outra data.')
    return
  }
  if (weekday === 6 && selectedTime > '17:00') {
    showError('Aos sábados o último horário é às 17:00.')
    return
  }

  showError('')
  const lines = [
    'Olá! Gostaria de agendar um horário na Navalha de Ouro.',
    '',
    `*Nome:* ${name}`,
    `*Serviço:* ${service}`,
    `*Barbeiro:* ${barber || 'Sem preferência'}`,
    `*Data:* ${formatDate(date)}`,
    `*Horário:* ${selectedTime}`,
  ]
  if (notes) lines.push(`*Observações:* ${notes}`)

  window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
})
