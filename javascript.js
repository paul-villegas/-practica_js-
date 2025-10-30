// Archivo: js/javascript.js
document.addEventListener('DOMContentLoaded', function(){

  // 1) Registro - validaciones
  const formRegistro = document.getElementById('formRegistro');
  const registroResultado = document.getElementById('registroResultado');

  formRegistro.addEventListener('submit', function(e){
    e.preventDefault();
    registroResultado.classList.remove('hidden');
    registroResultado.innerHTML = '';
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const pass = document.getElementById('pass').value;
    const pass2 = document.getElementById('pass2').value;

    // a) campos vacíos
    if(!nombre || !correo || !pass || !pass2){
      registroResultado.textContent = 'Error: Todos los campos son obligatorios.';
      registroResultado.style.color = 'red';
      return;
    }

    // b) correo que contenga @ y . usando indexOf
    if(correo.indexOf('@') === -1 || correo.indexOf('.') === -1){
      registroResultado.textContent = 'Error: Correo inválido (debe contener "@" y ".").';
      registroResultado.style.color = 'red';
      return;
    }

    // c) contraseña: al menos 8 caracteres, 1 número y 1 mayúscula
    const reNumero = /[0-9]/;
    const reMayus = /[A-Z]/;
    if(pass.length < 8 || !reNumero.test(pass) || !reMayus.test(pass)){
      registroResultado.textContent = 'Error: La contraseña debe tener al menos 8 caracteres, incluir un número y una letra mayúscula.';
      registroResultado.style.color = 'red';
      return;
    }

    // contraseñas iguales
    if(pass !== pass2){
      registroResultado.textContent = 'Error: Las contraseñas no coinciden.';
      registroResultado.style.color = 'red';
      return;
    }

    registroResultado.style.color = 'green';
    registroResultado.textContent = 'Registro exitoso. (Simulación)';
  });

  // 2) Primos hasta n - crear elementos en el DOM
  document.getElementById('btnPrimos').addEventListener('click', function(){
    const n = parseInt(document.getElementById('nPrimos').value, 10);
    const out = document.getElementById('primosResultado');
    out.innerHTML = '';
    if(isNaN(n) || n < 2){ out.textContent = 'Ingresa un número entero >= 2'; return; }
    const primes = [];
    for(let i=2;i<=n;i++){
      let esPrimo = true;
      for(let j=2;j*j<=i;j++){
        if(i%j===0){ esPrimo=false; break; }
      }
      if(esPrimo) primes.push(i);
    }
    const ul = document.createElement('ul');
    primes.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      ul.appendChild(li);
    });
    out.appendChild(document.createTextNode('Primos encontrados:'));
    out.appendChild(ul);
    out.appendChild(document.createElement('hr'));
    out.appendChild(document.createTextNode('Cantidad: ' + primes.length));
  });

  // 3) Split() - análisis de texto y mostrar en ventana nueva
  document.getElementById('btnSplit').addEventListener('click', function(){
    const texto = document.getElementById('textoSplit').value.trim();
    const out = document.getElementById('splitResultado');
    out.innerHTML = '';
    if(!texto){ out.textContent = 'Ingresa un texto.'; return; }
    const palabras = texto.split(/\s+/).filter(s=>s.length>0);
    const num = palabras.length;
    const primera = palabras[0] || '';
    const ultima = palabras[palabras.length-1] || '';
    const invertido = [...palabras].reverse();
    const ordenAZ = [...palabras].slice().sort((a,b)=> a.localeCompare(b));
    const ordenZA = [...ordenAZ].slice().reverse();

    out.innerHTML = `<strong>Número de palabras:</strong> ${num} <br>
      <strong>Primera:</strong> ${primera} <br>
      <strong>Última:</strong> ${ultima} <br>
      <strong>Invertido:</strong> ${invertido.join(', ')} <br>
      <strong>Orden A→Z:</strong> ${ordenAZ.join(', ')} <br>
      <strong>Orden Z→A:</strong> ${ordenZA.join(', ')}`;

    // abrir ventana nueva con la información
    const win = window.open('', '_blank', 'noopener');
    if(win){
      win.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Split - Resultado</title></head><body>');
      win.document.write('<h3>Resultado del análisis</h3>');
      win.document.write('<p>' + out.innerHTML + '</p>');
      win.document.write('</body></html>');
      win.document.close();
    }
  });

  // 4) Capicúa
  document.getElementById('btnCap').addEventListener('click', function(){
    const num = document.getElementById('numCap').value;
    const out = document.getElementById('capResultado');
    out.innerHTML = '';
    if(num === ''){ out.textContent = 'Ingresa un número.'; return; }
    const s = num.toString();
    const rev = s.split('').reverse().join('');
    if(s === rev) out.textContent = s + ' → Es capicúa';
    else out.textContent = s + ' → No es capicúa';
  });

  // 5) Examen - evaluación y temporizador de 5 minutos
  const respuestasCorrectas = { q1: 'a', q2: 'b', q3: 'b' };
  const formExamen = document.getElementById('formExamen');
  const examenResultado = document.getElementById('examenResultado');
  const btnEnviarExamen = document.getElementById('btnEnviarExamen');
  let tiempoSeg = 5 * 60;
  const timerSpan = document.getElementById('timer');

  function formatTime(s){
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const sec = (s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  }
  timerSpan.textContent = formatTime(tiempoSeg);
  const timerInterval = setInterval(()=>{
    tiempoSeg--;
    timerSpan.textContent = formatTime(tiempoSeg);
    if(tiempoSeg <= 0){
      clearInterval(timerInterval);
      evaluarExamen(true);
    }
  },1000);

  function obtenerRespuesta(nombre){
    const el = formExamen.elements[nombre];
    return el ? (el.value || null) : null;
  }

  function evaluarExamen(auto=false){
    // si auto=true se envía por tiempo terminado
    const respuestas = {
      q1: obtenerRespuesta('q1'),
      q2: obtenerRespuesta('q2'),
      q3: obtenerRespuesta('q3')
    };
    let correct = 0;
    const feedback = [];
    ['q1','q2','q3'].forEach(q=>{
      if(!respuestas[q]){
        feedback.push(q + ': No respondió. Respuesta correcta → ' + respuestasCorrectas[q]);
      } else if(respuestas[q] === respuestasCorrectas[q]){
        correct++;
      } else {
        feedback.push(q + ': Incorrecta. Correcta → ' + respuestasCorrectas[q]);
      }
    });
    const porcentaje = Math.round((correct / 3) * 100);
    examenResultado.innerHTML = `<strong>Correctas:</strong> ${correct} / 3<br>
      <strong>Porcentaje:</strong> ${porcentaje}%<br>`;
    if(feedback.length){
      examenResultado.innerHTML += '<hr><strong>Retroalimentación:</strong><br>' + feedback.join('<br>');
    }
    if(auto){
      examenResultado.innerHTML += '<br><em>Enviado automáticamente por agotamiento del tiempo.</em>';
    }
    // desactivar botones/inputs
    Array.from(formExamen.querySelectorAll('input')).forEach(i=>i.disabled = true);
    btnEnviarExamen.disabled = true;
  }

  btnEnviarExamen.addEventListener('click', function(){
    clearInterval(timerInterval);
    evaluarExamen(false);
  });

});