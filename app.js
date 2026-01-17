const LS_KEY = 'truco_anotador_v1'

const defaultState = () => ({
  teams: [ { name: 'NOSOTROS', score: 0 }, { name: 'ELLOS', score: 0 } ],
  history: [],
  target: 30
})

let state = loadState()

// DOM
const scoreEls = [document.getElementById('score-0'), document.getElementById('score-1')]
const nameInputs = Array.from(document.querySelectorAll('.team-name'))
// if page-history list removed, fall back to modal list
const historyList = document.getElementById('history-list') || document.getElementById('modal-history-list')
const targetInput = document.getElementById('target')

function loadState(){
  try{
    const raw = localStorage.getItem(LS_KEY)
    if(raw) return JSON.parse(raw)
  }catch(e){console.warn('No se pudo leer storage',e)}
  return defaultState()
}

function saveState(){
  localStorage.setItem(LS_KEY, JSON.stringify(state))
}

function render(){
  state.teams.forEach((t,i)=>{
    scoreEls[i].textContent = t.score
    nameInputs[i].value = t.name.toUpperCase()
  })
  if(targetInput) targetInput.value = state.target
  renderHistory()
  updateTally()
}

function pushHistory(entry){
  // attach the current total score for the team to the history entry
  if(typeof entry.team === 'number'){
    entry.total = state.teams[entry.team]?.score ?? null
  }
  state.history.unshift(entry)
  if(state.history.length>200) state.history.pop()
}

function addPoints(teamIndex, pts){
  const before = JSON.parse(JSON.stringify(state))
  state.teams[teamIndex].score = Math.max(0, state.teams[teamIndex].score + pts)
  pushHistory({time: Date.now(), team: teamIndex, pts})
  saveState()
  render()
  checkWinner()
  state._lastBefore = before
}

function undo(){
  if(state._lastBefore){
    state = state._lastBefore
    delete state._lastBefore
    saveState()
    render()
  } else if(state.history.length){
    const last = state.history.shift()
    state.teams[last.team].score -= last.pts
    saveState()
    render()
  }
}

function reset(){
  state = defaultState()
  saveState()
  render()
}

function renderHistory(){
  // Actualizar headers de la tabla con nombres de equipos
  const header0 = document.getElementById('team-header-0')
  const header1 = document.getElementById('team-header-1')
  if(header0) header0.textContent = state.teams[0]?.name || 'Equipo 1'
  if(header1) header1.textContent = state.teams[1]?.name || 'Equipo 2'
  
  // Obtener tbody
  const tbody = historyList.querySelector('tbody')
  if(!tbody) {
    historyList.innerHTML = ''
    return
  }
  
  tbody.innerHTML = ''
  
  // Verificar si está en modo agrupado (por defecto agrupado)
  const activeTab = document.querySelector('.history-tab.active')
  const isGrouped = !activeTab || activeTab.dataset.view === 'grouped'
  
  if(isGrouped) {
    renderGroupedHistory(tbody)
  } else {
    renderDetailedHistory(tbody)
  }
}

function renderDetailedHistory(tbody){
  // Construir historial con totales acumulados
  // Primero calcular totales acumulados desde el más antiguo al más reciente
  const historyReversed = [...state.history].reverse()
  const historyWithTotals = []
  let totals = [0, 0]
  
  historyReversed.forEach(h=>{
    totals[h.team] += h.pts
    historyWithTotals.push({
      ...h,
      totalsSnapshot: [totals[0], totals[1]]
    })
  })
  
  // Luego renderizar del más reciente al más antiguo (invertir de nuevo)
  historyWithTotals.reverse().forEach(h=>{
    const tr = document.createElement('tr')
    const t = new Date(h.time).toLocaleTimeString()
    const teamName = state.teams[h.team]?.name.toUpperCase() || `Equipo ${h.team+1}`
    const ptsText = h.pts > 0 ? `+${h.pts}` : `${h.pts}`
    
    // Usar totales del snapshot
    const totalsSnapshot = h.totalsSnapshot
    
    // Columna hora
    const tdTime = document.createElement('td')
    tdTime.textContent = t
    tdTime.className = 'hist-time'
    
    // Columna equipo 0
    const tdTeam0 = document.createElement('td')
    tdTeam0.textContent = totalsSnapshot[0]
    tdTeam0.className = 'hist-score'
    if(h.team === 0) tdTeam0.classList.add('hist-active')
    
    // Columna equipo 1
    const tdTeam1 = document.createElement('td')
    tdTeam1.textContent = totalsSnapshot[1]
    tdTeam1.className = 'hist-score'
    if(h.team === 1) tdTeam1.classList.add('hist-active')
    
    // Columna acción
    const tdAction = document.createElement('td')
    tdAction.textContent = `${teamName} ${ptsText}`
    tdAction.className = 'hist-action'
    if(h.pts > 0) tdAction.classList.add('hist-sum')
    else tdAction.classList.add('hist-rest')
    
    tr.appendChild(tdAction)
    tr.appendChild(tdTime)
    tr.appendChild(tdTeam0)
    tr.appendChild(tdTeam1)
    tbody.appendChild(tr)
  })
}

function renderGroupedHistory(tbody){
  // Agrupar acciones que ocurrieron en una ventana de 60 segundos
  // Mostrar ambos equipos en la misma línea
  const historyReversed = [...state.history].reverse()
  const groups = []
  let totals = [0, 0]
  
  // Calcular totales y crear grupos por ventana de tiempo
  historyReversed.forEach((h) => {
    totals[h.team] += h.pts
    
    // Buscar si puede unirse a un grupo existente (ventana de 60 segundos)
    let joined = false
    for(let i = groups.length - 1; i >= 0; i--) {
      const g = groups[i]
      const timeDiff = Math.abs(h.time - g.startTime) / 1000 // en segundos
      
      // Agrupar si está dentro de 60 segundos
      if(timeDiff <= 60) {
        // Agregar puntos al equipo correspondiente
        g.teams[h.team] += h.pts
        g.endTime = h.time
        g.totalsSnapshot = [totals[0], totals[1]]
        joined = true
        break
      }
    }
    
    // Si no se unió a ningún grupo, crear uno nuevo
    if(!joined) {
      const newGroup = {
        teams: [0, 0], // [equipo0, equipo1]
        startTime: h.time,
        endTime: h.time,
        totalsSnapshot: [totals[0], totals[1]]
      }
      newGroup.teams[h.team] = h.pts
      groups.push(newGroup)
    }
  })
  
  // Renderizar grupos del más reciente al más antiguo
  groups.reverse().forEach(g => {
    const tr = document.createElement('tr')
    const t = new Date(g.endTime).toLocaleTimeString()
    
    // Construir texto de acción mostrando ambos equipos
    const team0Name = state.teams[0]?.name.toUpperCase() || 'EQUIPO 1'
    const team1Name = state.teams[1]?.name.toUpperCase() || 'EQUIPO 2'
    
    let actionParts = []
    if(g.teams[0] !== 0) {
      const pts0 = g.teams[0] > 0 ? `+${g.teams[0]}` : `${g.teams[0]}`
      actionParts.push(`${team0Name} ${pts0}`)
    }
    if(g.teams[1] !== 0) {
      const pts1 = g.teams[1] > 0 ? `+${g.teams[1]}` : `${g.teams[1]}`
      actionParts.push(`${team1Name} ${pts1}`)
    }
    
    const actionText = actionParts.length > 0 ? actionParts.join(' | ') : 'Sin cambios'
    
    // Columna acción
    const tdAction = document.createElement('td')
    tdAction.textContent = actionText
    tdAction.className = 'hist-action'
    
    // Columna hora
    const tdTime = document.createElement('td')
    tdTime.textContent = t
    tdTime.className = 'hist-time'
    
    // Columna equipo 0
    const tdTeam0 = document.createElement('td')
    tdTeam0.textContent = g.totalsSnapshot[0]
    tdTeam0.className = 'hist-score'
    if(g.teams[0] !== 0) tdTeam0.classList.add('hist-active')
    
    // Columna equipo 1
    const tdTeam1 = document.createElement('td')
    tdTeam1.textContent = g.totalsSnapshot[1]
    tdTeam1.className = 'hist-score'
    if(g.teams[1] !== 0) tdTeam1.classList.add('hist-active')
    
    tr.appendChild(tdAction)
    tr.appendChild(tdTime)
    tr.appendChild(tdTeam0)
    tr.appendChild(tdTeam1)
    tbody.appendChild(tr)
  })
}

function checkWinner(){
  const tgt = Number(state.target)
  state.teams.forEach((t,i)=>{
    if(t.score>=tgt){
      // prevent multiple modals if already shown
      if(!state._winnerShown){
        state._winnerShown = true
        setTimeout(()=> openWinModal(i),50)
      }
    }
  })
}

// Win modal handling
const winModal = document.getElementById('win-modal')
const winTitle = document.getElementById('win-title')
const winMessage = document.getElementById('win-message')
const winYes = document.getElementById('win-yes')
const winNo = document.getElementById('win-no')

function openWinModal(teamIdx){
  const team = state.teams[teamIdx]
  if(!winModal) return
  winTitle.textContent = `${team.name} ganó el partido`
  winMessage.textContent = '¿Jugamos de nuevo?'
  winModal.setAttribute('aria-hidden','false')
}

function closeWinModal(){
  if(!winModal) return
  winModal.setAttribute('aria-hidden','true')
  state._winnerShown = false
}

function newGameKeepNames(){
  // Clear scores and history, keep team names
  state.history = []
  state.teams.forEach(t => t.score = 0)
  saveState()
  render()
  closeWinModal()
}

if(winYes) winYes.addEventListener('click', ()=>{ newGameKeepNames() })
if(winNo) winNo.addEventListener('click', ()=>{ closeWinModal() })

// Listeners
document.querySelectorAll('[data-add]').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const pts = Number(btn.dataset.add)
    const teamEl = btn.closest('.team')
    const idx = Number(teamEl.dataset.team)
    addPoints(idx, pts)
  })
})

nameInputs.forEach((inp,i)=>{
  inp.addEventListener('input', ()=>{
    state.teams[i].name = inp.value || (`Equipo ${i+1}`)
    saveState()
    renderHistory()
  })

  // click header to focus and select the input (make clear it's editable)
  const teamEl = inp.closest('.team')
  if(teamEl){
    const header = teamEl.querySelector('.team-header')
    if(header){
      header.style.cursor = 'text'
      header.addEventListener('click', ()=>{
        inp.focus()
        try{ inp.select() }catch(e){}
      })
    }
  }

  // keyboard shortcuts: Enter to save/blur, Escape to revert
  inp.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      e.preventDefault()
      inp.blur()
    } else if(e.key === 'Escape'){
      inp.value = state.teams[i].name || (`Equipo ${i+1}`)
      inp.blur()
    }
  })

  // ensure changes persist on blur
  inp.addEventListener('blur', ()=>{
    state.teams[i].name = inp.value || (`Equipo ${i+1}`)
    saveState()
    renderHistory()
  })
})

// Menu toggle and menu action bindings
const menuToggle = document.getElementById('menu-toggle')
const sideMenu = document.getElementById('side-menu')
const menuClose = document.getElementById('menu-close')
const menuUndo = document.getElementById('menu-undo')
const menuReset = document.getElementById('menu-reset')
const menuHistoryBtn = document.getElementById('menu-history')

if(menuToggle){
  menuToggle.addEventListener('click', ()=>{ if(sideMenu) sideMenu.setAttribute('aria-hidden','false') })
}
if(menuClose){
  menuClose.addEventListener('click', ()=>{ if(sideMenu) sideMenu.setAttribute('aria-hidden','true') })
}
if(menuUndo){
  menuUndo.addEventListener('click', ()=>{ undo(); if(sideMenu) sideMenu.setAttribute('aria-hidden','true') })
}
if(menuReset){
  menuReset.addEventListener('click', ()=>{ openResetModal(); if(sideMenu) sideMenu.setAttribute('aria-hidden','true') })
}
if(menuHistoryBtn){
  menuHistoryBtn.addEventListener('click', ()=>{ openHistory(); if(sideMenu) sideMenu.setAttribute('aria-hidden','true') })
}

if(targetInput){
  targetInput.addEventListener('change', ()=>{ state.target = Number(targetInput.value) || 30; saveState() })
}

// export/import buttons were removed from the UI; continue with modal history behavior

const modal = document.getElementById('history-modal')
const modalList = document.getElementById('modal-history-list')
const openHistoryBtn = document.getElementById('open-history')
const closeHistoryBtn = document.getElementById('close-history')

// Tabs para cambiar entre vista agrupada y detallada
const historyTabs = document.querySelectorAll('.history-tab')

function openHistory(){
  // Resetear el tab activo a "Agrupado" cada vez que se abre el modal
  historyTabs.forEach(t => t.classList.remove('active'))
  const groupedTab = document.querySelector('.history-tab[data-view="grouped"]')
  if(groupedTab) groupedTab.classList.add('active')
  
  modal.setAttribute('aria-hidden','false')
  renderHistory() // Usar la misma función que actualiza la tabla
}
function closeHistory(){
  modal.setAttribute('aria-hidden','true')
}

if(openHistoryBtn) openHistoryBtn.addEventListener('click', openHistory)
if(closeHistoryBtn) closeHistoryBtn.addEventListener('click', closeHistory)
if(modal){
  const bd = modal.querySelector('.modal-backdrop')
  if(bd) bd.addEventListener('click', closeHistory)
}

// Event listeners para los tabs
historyTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remover clase active de todos los tabs
    historyTabs.forEach(t => t.classList.remove('active'))
    // Agregar clase active al tab clickeado
    tab.classList.add('active')
    // Re-renderizar historial
    renderHistory()
  })
})

// Compute the total score that the team had at the moment of this history entry.
// If the entry already stores `.total` we can use it; otherwise reconstruct by
// summing history entries from oldest up to (and including) this one for the same team.
function computeTotalAtHistoryEntry(entry){
  if(entry && entry.total !== undefined && entry.total !== null) return entry.total
  const hist = state.history || []
  // Find the index of this entry instance in the history array (by time + team + pts)
  let idx = -1
  for(let i=hist.length-1;i>=0;i--){
    const h = hist[i]
    if(h.time === entry.time && h.team === entry.team && h.pts === entry.pts){ idx = i; break }
  }
  // If not found, as a fallback compute total by summing all history for that team
  if(idx === -1) idx = hist.length-1

  // Sum from oldest (end of array) up to idx (inclusive)
  let total = 0
  for(let i=hist.length-1; i>=idx; i--){
    const h = hist[i]
    if(h.team === entry.team) total += Number(h.pts)
  }
  // Also add any initial score stored in state if history doesn't cover it
  // (assume default 0 otherwise)
  const initial = 0
  return initial + total
}

// Usa directamente los archivos SVG de la carpeta assets
function getPapafritaSVG(idx, position){
  const num = (idx % 5) + 1;
  // Usar SVG horizontal para top y bottom
  if(position === 'top' || position === 'bottom') {
    return `<img src="assets/papafrita-horizontal.svg" alt="papafrita" style="width:100%;height:100%">`;
  }
  return `<img src="assets/papafrita${num}.svg" alt="papafrita" style="width:100%;height:100%">`;
}

// Tally (fosforos) helpers
function buildTallies(){
  // Build tallies based on current score so matches appear as points increase
  const max = Number(state.target) || 30
  document.querySelectorAll('.tally').forEach((tally, teamIdx)=>{
    tally.innerHTML = ''

    const score = state.teams[teamIdx]?.score || 0
    const target = Number(state.target) || 30
    const totalGroups = Math.max(6, Math.ceil(target / 5))
    for(let g=0; g<totalGroups; g++){
      const grp = document.createElement('div')
      grp.className = 'group'
      grp.dataset.g = g
      const startIdx = g*5
      const filledInGroup = Math.max(0, Math.min(5, score - startIdx))

      // Renderizar papafritas en marco cuadrado: top, right, bottom, left, diagonal
      const positions = ['top', 'right', 'bottom', 'left', 'diag'];
      for(let j=0; j<5; j++){
        const idx = startIdx + j;
        const pos = positions[j];
        const papa = document.createElement('div');
        papa.className = 'papa papa-' + pos;
        if(j < filledInGroup) {
          papa.classList.add('filled');
          const svgIdx = idx % 5;
          papa.innerHTML = getPapafritaSVG(svgIdx, pos);
        }
        grp.appendChild(papa);
      }

      // if fully filled, add a class to style the diagonal strongly
      if(filledInGroup >= 5) grp.classList.add('cross')
      tally.appendChild(grp)
      
      // Agregar línea divisoria después del grupo que contiene el punto 15 solo si el puntaje supera 15
      const groupEndPoint = (g + 1) * 5;
      if(groupEndPoint === 15 && score > 15) {
        const divider = document.createElement('div');
        divider.className = 'tally-divider';
        tally.appendChild(divider);
      }
    }
    // no height adjustment: allow .tally to grow so groups keep fixed size
    // remember last rendered score for this tally
    tally.dataset._lastScore = score
  })
}

function updateTally(){
  state.teams.forEach((t,i)=>{
    const el = document.getElementById('tally-'+i)
    if(!el) return
    const prev = el.dataset._lastScore ? Number(el.dataset._lastScore) : 0
    if(prev !== t.score){
      buildTallies()
    }
  })
}

// Attach tally click handlers (touch-friendly)
function initTallyListeners(){
  document.querySelectorAll('.tally').forEach(t=>{
    t.addEventListener('click', ()=>{
      const idx = Number(t.dataset.team)
      addPoints(idx, 1)
    })
  })
}

// Reset confirmation modal
const resetModal = document.getElementById('reset-modal')
const resetYes = document.getElementById('reset-yes')
const resetNo = document.getElementById('reset-no')

function openResetModal(){
  if(resetModal) resetModal.setAttribute('aria-hidden','false')
}
function closeResetModal(){
  if(resetModal) resetModal.setAttribute('aria-hidden','true')
}

if(resetYes){
  resetYes.addEventListener('click', ()=>{
    reset()
    closeResetModal()
  })
}
if(resetNo){
  resetNo.addEventListener('click', closeResetModal)
}
if(resetModal){
  const bd = resetModal.querySelector('.modal-backdrop')
  if(bd) bd.addEventListener('click', closeResetModal)
}

// Inicializar
buildTallies()
initTallyListeners()
render()
