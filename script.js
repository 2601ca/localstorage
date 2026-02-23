const STORAGE_KEY = "minhas-tarefas-v2";
let tarefas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

function atualizarStatus() {
  const concluidas = tarefas.filter(t => t.concluida).length;
  const total = tarefas.length;
  
  document.getElementById("status").innerHTML =
    total === 0
      ? "Nenhuma tarefa ainda"
      : `${total} tarefa${total !== 1 ? 's' : ''} • ${concluidas} concluída${concluidas !== 1 ? 's' : ''}`;
}

function renderizar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  if (tarefas.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.innerHTML = "Comece adicionando uma tarefa acima!";
    lista.appendChild(li);
    atualizarStatus();
    return;
  }

  tarefas.forEach((t, i) => {
    const li = document.createElement("li");
    if (t.concluida) li.classList.add("concluida");

    const span = document.createElement("span");
    span.className = "tarefa-texto";
    span.textContent = t.texto;

    const divBotoes = document.createElement("div");
    divBotoes.className = "botoes";

    const btnCheck = document.createElement("button");
    btnCheck.className = "btn-acao btn-concluir";
    btnCheck.textContent = t.concluida ? "↺" : "✓";
    btnCheck.title = t.concluida ? "Reabrir tarefa" : "Concluir tarefa";
    btnCheck.onclick = () => {
      tarefas[i].concluida = !tarefas[i].concluida;
      salvar();
      renderizar();
    };

    const btnDel = document.createElement("button");
    btnDel.className = "btn-acao btn-excluir";
    btnDel.textContent = "×";
    btnDel.title = "Excluir tarefa";
    btnDel.onclick = () => {
      if (confirm("Excluir esta tarefa?")) {
        tarefas.splice(i, 1);
        salvar();
        renderizar();
      }
    };

    divBotoes.append(btnCheck, btnDel);
    li.append(span, divBotoes);
    lista.appendChild(li);
  });

  atualizarStatus();
}

function adicionar() {
  const input = document.getElementById("novaTarefa");
  const texto = input.value.trim();
  
  if (!texto) return input.focus();

  tarefas.unshift({ texto, concluida: false }); // adiciona no início
  input.value = "";
  salvar();
  renderizar();
  input.focus();
}

// Eventos
document.getElementById("btnAdicionar").onclick = adicionar;

document.getElementById("novaTarefa").onkeydown = e => {
  if (e.key === "Enter") {
    e.preventDefault();
    adicionar();
  }
};

// Inicializa
renderizar();
