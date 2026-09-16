// ---------- elementos ----------

const agentEls = {
    toggle: document.getElementById('agent-toggle'),
    popup: document.getElementById('agent-popup'),
    close: document.getElementById('agent-close'),
    messages: document.getElementById('agent-messages'),
    typing: document.getElementById('agent-typing'),
    form: document.getElementById('agent-form'),
    input: document.getElementById('agent-input'),
    send: document.getElementById('agent-send'),
};

// histórico da conversa — importante manter pro contexto da IA nas próximas mensagens
const conversationHistory = [];

// ---------- abrir / fechar ----------

agentEls.toggle.addEventListener('click', () => {
    agentEls.popup.classList.remove('hidden');
    agentEls.toggle.classList.add('hidden');
    agentEls.input.focus();
});

agentEls.close.addEventListener('click', () => {
    agentEls.popup.classList.add('hidden');
    agentEls.toggle.classList.remove('hidden');
});

// ---------- textarea que cresce sozinha até um limite ----------

agentEls.input.addEventListener('input', () => {
    agentEls.input.style.height = 'auto';
    agentEls.input.style.height = `${Math.min(agentEls.input.scrollHeight, 192)}px`;
});

// enter envia, shift+enter quebra linha
agentEls.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        agentEls.form.requestSubmit();
    }
});

// ---------- renderizar mensagem ----------

function addMessage(text, role) {
    const bubble = document.createElement('div');
    bubble.className = `agent-message ${role}`;
    bubble.textContent = text;
    agentEls.messages.appendChild(bubble);
    agentEls.messages.scrollTop = agentEls.messages.scrollHeight;
    return bubble;
}

function setTyping(isTyping) {
    agentEls.typing.classList.toggle('hidden', !isTyping);
    if (isTyping) {
        agentEls.messages.scrollTop = agentEls.messages.scrollHeight;
    }
}

// ---------- envio ----------

agentEls.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = agentEls.input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    conversationHistory.push({ role: 'user', content: text });

    agentEls.input.value = '';
    agentEls.input.style.height = 'auto';
    agentEls.send.disabled = true;
    setTyping(true);

    try {
        const reply = await askAssistant(text);
        conversationHistory.push({ role: 'assistant', content: reply });
        addMessage(reply, 'assistant');
    } catch (err) {
        console.error('Erro no assistente:', err);
        addMessage('Não consegui responder agora. Tente novamente em instantes.', 'error');
    } finally {
        setTyping(false);
        agentEls.send.disabled = false;
        agentEls.input.focus();
    }
});

// ---------- chamada pro backend/IA — AJUSTE AQUI ----------

async function askAssistant(message) {
    // Envia o histórico inteiro (não só a mensagem atual) pra IA ter contexto.
    // Ajuste a URL/payload conforme o endpoint real do seu backend.
    const response = await fetch(`${testURL}/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            history: conversationHistory,
            // dá contexto do estado atual do equipamento pra IA responder com dados reais
            context: {
                temperaturaDestilador: state.temperaturaDestilador,
                temperaturaResfriador: state.temperaturaResfriador,
                pressaoMangueira: state.pressaoMangueira,
                nivel: state.nivel,
                aquecimento: state.aquecimento,
                resfriamento: state.resfriamento,
                operando: state.operando,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.reply; // ajuste conforme o formato de resposta do seu backend
}