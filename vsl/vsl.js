document.addEventListener('DOMContentLoaded', () => {
    const viewerCountEl = document.getElementById('viewer-count');

    // Geração inicial entre 600 e 800
    let currentViewers = Math.floor(Math.random() * (800 - 600 + 1)) + 600;
    viewerCountEl.textContent = currentViewers;

    // Atualiza a cada 3~5 segundos para variar de pouco em pouco
    setInterval(() => {
        // Variação orgânica entre -2 e +4 pessoas
        const change = Math.floor(Math.random() * 7) - 2;
        currentViewers += change;

        // Mantém dentro de certos limites para que não esvazie ou loto demais artificialmente
        if (currentViewers < 600) {
            currentViewers = 600 + Math.floor(Math.random() * 15);
        } else if (currentViewers > 850) {
            currentViewers = 850 - Math.floor(Math.random() * 15);
        }

        viewerCountEl.textContent = currentViewers;
    }, 4500); // 4.5s

    // Contador simulado de compradores "Aleatórios"
    const buyersCountEl = document.getElementById('buyers-count');
    if (buyersCountEl) {
        buyersCountEl.textContent = Math.floor(Math.random() * (18 - 6 + 1)) + 6;
        setInterval(() => {
            // Pode aumentar ou baixar levemente a cada 8 segundos
            let num = parseInt(buyersCountEl.textContent);
            num += Math.floor(Math.random() * 3) - 1;
            if (num < 5) num = 5 + Math.floor(Math.random() * 5);
            buyersCountEl.textContent = num;
        }, 8000);
    }

    // Configuração do Botão Delay (Liberação da oferta aos 13:30)
    const OFFER_MINUTES = 13;
    const OFFER_SECONDS = 30;
    const TOTAL_OFFER_MS = ((OFFER_MINUTES * 60) + OFFER_SECONDS) * 1000;

    // Configuração do Contador (Aparece aos 16:35)
    const TIMER_MINUTES = 16;
    const TIMER_SECONDS = 35;
    const TOTAL_TIMER_MS = ((TIMER_MINUTES * 60) + TIMER_SECONDS) * 1000;

    const delayedOffer = document.getElementById('delayed-offer');
    if (delayedOffer) {
        // Fallback básico para liberar a oferta
        let offerFallback = setTimeout(() => {
            showOffer();
        }, TOTAL_OFFER_MS);

        // Fallback básico para o timer
        let timerFallback = setTimeout(() => {
            showTimer();
        }, TOTAL_TIMER_MS);

        // Sincronização com o VTurb
        const checkVTurb = setInterval(() => {
            try {
                if (window.smartplayer && window.smartplayer.instances) {
                    const instances = window.smartplayer.instances;
                    const playerKey = Object.keys(instances)[0]; 
                    const player = instances[playerKey];

                    if (player && player.video) {
                        const videoTime = player.video.currentTime;
                        // console.log("VTurb Time:", videoTime); // Debug opcional

                        // Verifica liberação da oferta
                        if (videoTime >= (OFFER_MINUTES * 60) + OFFER_SECONDS) {
                            showOffer();
                        }

                        // Verifica exibição do timer
                        if (videoTime >= (TIMER_MINUTES * 60) + TIMER_SECONDS) {
                            showTimer();
                            clearInterval(checkVTurb);
                        }
                    }
                }
            } catch (e) {
                console.error("Erro ao sincronizar VTurb:", e);
            }
        }, 1000);

        function showOffer() {
            if (delayedOffer.style.display !== 'flex') {
                delayedOffer.style.display = 'flex';
                clearTimeout(offerFallback);
            }
        }

        function showTimer() {
            const timerContainer = document.querySelector('.countdown-container');
            if (timerContainer && timerContainer.style.display !== 'block') {
                timerContainer.style.display = 'block';
                clearTimeout(timerFallback);
                startCountdown(30 * 60); // 30 minutos
            }
        }

        function startCountdown(duration) {
            const timerDisplay = document.getElementById('countdown-timer');
            let timer = duration, minutes, seconds;
            const interval = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                timerDisplay.textContent = minutes + ":" + seconds;

                if (--timer < 0) {
                    clearInterval(interval);
                    timerDisplay.textContent = "00:00";
                }
            }, 1000);
        }
    }
});
