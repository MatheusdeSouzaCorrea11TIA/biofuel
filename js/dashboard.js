// ---------- estado ----------

const state = {
    temperaturaDestilador: 0,   // ºC
    temperaturaResfriador: 0,   // ºC
    aquecimento: false,
    aquecimentoPausado: false,
    resfriamento: false,
    resfriamentoPausado: false,
    pressaoMangueira: 0,        // MPa
    nivel: 0,                   // %
    avisos: 0,
    tempoProducaoSegundos: 0,
    operando: false,
};

// históricos p/ sparklines (últimos N pontos)
const HISTORY_SIZE = 30;
const history = {
    temperaturaDestilador: [],
    temperaturaResfriador: [],
    pressaoMangueira: [],
};

function pushHistory(key, value) {
    const arr = history[key];
    arr.push(value);
    if (arr.length > HISTORY_SIZE) arr.shift();
}

// ---------- helper: lê variável CSS do :root ----------

function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ---------- elementos ----------

const els = {
    tempDestilador: document.getElementById('temp-destilador'),
    tempResfriador: document.getElementById('temp-resfriador'),
    aquecimentoStatus: document.getElementById('aquecimento-status'),
    resfriamentoStatus: document.getElementById('resfriamento-status'),
    pressao: document.getElementById('pressao'),
    nivel: document.getElementById('nivel'),
    avisosCount: document.getElementById('avisos-count'),
    analiseValor: document.getElementById('analise-valor'),
    operationStatus: document.getElementById('operation-status'),
    tempoProducao: document.getElementById('tempo-producao'),
    levelMeter: document.getElementById('level-meter'),

    sparkTempDestilador: document.getElementById('spark-temp-destilador'),
    sparkTempResfriador: document.getElementById('spark-temp-resfriador'),
    sparkPressao: document.getElementById('spark-pressao'),
    chartGeral: document.getElementById('chart-geral'),

    btnStart: document.getElementById('start'),
    btnPause: document.getElementById('pause'),
    btnStop: document.getElementById('stop'),

    btnPauseAquecimento: document.getElementById('pause-aquecimento'),
    btnPauseResfriamento: document.getElementById('pause-resfriamento'),
};

// ---------- render ----------

function render() {
    els.tempDestilador.textContent = `${state.temperaturaDestilador.toFixed(1)}ºC`;
    els.tempResfriador.textContent = `${state.temperaturaResfriador.toFixed(1)}ºC`;
    els.pressao.textContent = `${state.pressaoMangueira.toFixed(2)}MPa`;
    els.nivel.textContent = `${Math.round(state.nivel)}%`;
    els.avisosCount.textContent = state.avisos;

    els.aquecimentoStatus.textContent = state.aquecimento && state.operando ? 'Ligado' : 'Desligado';
    els.aquecimentoStatus.classList.toggle('on', state.aquecimento && state.operando);
    els.aquecimentoStatus.classList.toggle('off', !state.aquecimento|| !state.operando);
    els.aquecimentoStatus.closest('.value-box').classList.toggle('active', state.aquecimento && state.operando);

    els.resfriamentoStatus.textContent = state.resfriamento && state.operando ? 'Ligado' : 'Desligado';
    els.resfriamentoStatus.classList.toggle('on', state.resfriamento && state.operando);
    els.resfriamentoStatus.classList.toggle('off', !state.resfriamento || !state.operando);
    els.resfriamentoStatus.closest('.value-box').classList.toggle('active', state.resfriamento && state.operando);

    els.operationStatus.textContent = state.operando ? 'Operação em andamento' : 'Operação não iniciada';
    els.tempoProducao.textContent = formatTime(state.tempoProducaoSegundos);

    els.btnPauseAquecimento.disabled = !state.operando;
    els.btnPauseResfriamento.disabled = !state.operando;

    els.btnPauseAquecimento.textContent = state.aquecimentoPausado ? 'Retomar' : 'Pausar';
    els.btnPauseAquecimento.classList.toggle('paused', state.aquecimentoPausado);

    els.btnPauseResfriamento.textContent = state.resfriamentoPausado ? 'Retomar' : 'Pausar';
    els.btnPauseResfriamento.classList.toggle('paused', state.resfriamentoPausado);

    renderLevelMeter();
    renderAnaliseGeral();

    drawSparkline(els.sparkTempDestilador, history.temperaturaDestilador, cssVar('--green'));
    drawSparkline(els.sparkTempResfriador, history.temperaturaResfriador, cssVar('--purple'));
    drawSparkline(els.sparkPressao, history.pressaoMangueira, cssVar('--orange'));

    drawBarChart(els.chartGeral, {
        Temperatura: percentFromRange(state.temperaturaDestilador, 0, 120),
        Pressão: percentFromRange(state.pressaoMangueira, 0, 1),
        Nível: state.nivel,
        Total: analiseGeralPercent(),
    });
}

function formatTime(totalSeconds) {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function percentFromRange(value, min, max) {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function analiseGeralPercent() {
    // média simples — ajuste a fórmula conforme a regra de negócio real
    const t = percentFromRange(state.temperaturaDestilador, 0, 120);
    const p = percentFromRange(state.pressaoMangueira, 0, 1);
    const n = state.nivel;
    return Math.round((t + p + n) / 3);
}

function renderAnaliseGeral() {
    const pct = analiseGeralPercent();
    els.analiseValor.textContent = `${pct}%`;
}

function renderLevelMeter() {
    const segments = els.levelMeter.querySelectorAll('span');
    const filledCount = Math.round((state.nivel / 100) * segments.length);
    segments.forEach((seg, i) => seg.classList.toggle('filled', i < filledCount));
}

// ---------- sparkline (canvas simples) ----------

function drawSparkline(canvas, data, color) {
    if (!canvas || data.length < 2) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // trava o tamanho de EXIBIÇÃO em px fixos — o canvas não tem mais
    // um tamanho intrínseco ambíguo pro navegador "adivinhar"
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
    }

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    ctx.beginPath();
    data.forEach((value, i) => {
        const x = (i / (data.length - 1)) * rect.width;
        const y = rect.height - ((value - min) / range) * rect.height;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // preenchimento leve embaixo da linha
    ctx.lineTo(rect.width, rect.height);
    ctx.lineTo(0, rect.height);
    ctx.closePath();
    ctx.fillStyle = color + '22';
    ctx.fill();
}

// ---------- gráfico de barras (container-average) ----------

function drawBarChart(canvas, values) {
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
    }

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const padding = { top: 10, right: 10, bottom: 30, left: 40 };
    const chartW = rect.width - padding.left - padding.right;
    const chartH = rect.height - padding.top - padding.bottom;

    // cores lidas do tema atual
    const gridColor = cssVar('--card-border') || 'rgba(255,255,255,0.08)';
    const labelColor = cssVar('--gray') || 'rgba(255,255,255,0.35)';
    const barColor = cssVar('--green');
    const totalColor = cssVar('--purple');

    // linhas de grade (0/25/50/75/100%)
    ctx.strokeStyle = gridColor;
    ctx.fillStyle = labelColor;
    ctx.font = '11px Roboto';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    [0, 25, 50, 75, 100].forEach(pct => {
        const y = padding.top + chartH - (pct / 100) * chartH;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartW, y);
        ctx.stroke();
        ctx.fillText(`${pct}%`, padding.left - 8, y);
    });

    // barras
    const labels = Object.keys(values);
    const barSlot = chartW / labels.length;
    const barWidth = barSlot * 0.45;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    labels.forEach((label, i) => {
        const value = Math.max(0, Math.min(100, values[label]));
        const barHeight = (value / 100) * chartH;
        const x = padding.left + i * barSlot + (barSlot - barWidth) / 2;
        const y = padding.top + chartH - barHeight;

        const isTotal = label === 'Total';
        ctx.fillStyle = isTotal ? totalColor : barColor;

        const radius = 4;
        ctx.beginPath();
        ctx.moveTo(x, y + barHeight);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, y + barHeight);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = labelColor;
        ctx.fillText(label, x + barWidth / 2, padding.top + chartH + 8);
    });
}

function updateElapsedTime(startedAt) {
    const elapsedMs = Date.now() - startedAt;
    state.tempoProducaoSegundos = Math.floor(elapsedMs / 1000);
    els.tempoProducao.textContent = formatTime(state.tempoProducaoSegundos);
}

// ---------- socket.io ----------
const backendURL = "https://biofuel-backend-8r7x8mm0v.vercel.app/"
const testURL = "http://localhost:3000"
const socket = io(testURL);

// ajuste os nomes de evento conforme seu backend
let timerInterval = null;

socket.on('dashboard:update', (data) => {
    Object.assign(state, data);

    console.log(data)

    if ('temperaturaDestilador' in data) pushHistory('temperaturaDestilador', data.temperaturaDestilador);
    if ('temperaturaResfriador' in data) pushHistory('temperaturaResfriador', data.temperaturaResfriador);
    if ('pressaoMangueira' in data) pushHistory('pressaoMangueira', data.pressaoMangueira);

    // se veio um novo startedAt, (re)inicia o cronômetro local
    if ('startedAt' in data) {
        clearInterval(timerInterval);
        if (data.startedAt) {
            timerInterval = setInterval(() => updateElapsedTime(data.startedAt), 1000);
            updateElapsedTime(data.startedAt); // já mostra sem esperar 1s
        } else {
            state.tempoProducaoSegundos = 0;
            els.tempoProducao.textContent = formatTime(0);
        }
    }

    render();
});

// ---------- botões ----------

els.btnStart.addEventListener('click', () => {
    state.operando = true;
    socket.emit('equipamento:iniciar');
    render();
});

els.btnPauseAquecimento.addEventListener('click', () => {
    state.aquecimentoPausado = !state.aquecimentoPausado;
    socket.emit(state.aquecimentoPausado ? 'aquecimento:pausar' : 'aquecimento:retomar');
    render();
});

els.btnPauseResfriamento.addEventListener('click', () => {
    state.resfriamentoPausado = !state.resfriamentoPausado;
    socket.emit(state.resfriamentoPausado ? 'resfriamento:pausar' : 'resfriamento:retomar');
    render();
});

els.btnStop.addEventListener('click', () => {
    state.operando = false;
    socket.emit('equipamento:desligar');
    render();
});

document.getElementById('show-warnings')?.addEventListener('click', () => {
    // abrir modal/lista de avisos
});

// ---------- redesenha em resize ----------

window.addEventListener('resize', render);

// ---------- primeira renderização ----------

// popula histórico inicial pra sparklines não ficarem vazios
for (let i = 0; i < 5; i++) {
    pushHistory('temperaturaDestilador', 0);
    pushHistory('temperaturaResfriador', 0);
    pushHistory('pressaoMangueira', 0);
}

function changeUserLabelName() {
    const user = JSON.parse(localStorage.getItem("User"))
    const userLabel = document.querySelector(".user-name")
    userLabel.innerHTML = user.name
}

changeUserLabelName()
render();