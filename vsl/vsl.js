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
    const OFFER_DELAY = (13 * 60 + 30) * 1000;
    // Configuração do Contador (Aparece aos 16:35)
    const TIMER_DELAY = (16 * 60 + 35) * 1000;

    const delayedOffer = document.getElementById('delayed-offer');
    if (delayedOffer) {
        let offerShown = false;
        let timerShown = false;

        // Gatilhos de tempo simples (Baseados no carregamento da página)
        setTimeout(showOffer, OFFER_DELAY);
        setTimeout(showTimer, TIMER_DELAY);

        // Sincronização secundária com VTurb
        const checkVTurb = setInterval(() => {
            try {
                if (window.smartplayer && window.smartplayer.instances && window.smartplayer.instances[0]) {
                    const videoTime = window.smartplayer.instances[0].video.currentTime;
                    if (videoTime >= (13 * 60 + 30)) showOffer();
                    if (videoTime >= (16 * 60 + 35)) {
                        showTimer();
                        clearInterval(checkVTurb);
                    }
                }
            } catch (e) { }
        }, 1000);

        function showOffer() {
            if (offerShown) return;
            delayedOffer.style.display = 'flex';
            offerShown = true;
        }

        function showTimer() {
            if (timerShown) return;
            const timerContainer = document.querySelector('.countdown-container');
            if (timerContainer) {
                timerContainer.style.display = 'block';
                startCountdown(30 * 60);
                timerShown = true;
            }
        }

        function startCountdown(duration) {
            const timerDisplay = document.getElementById('countdown-timer');
            if (!timerDisplay) return;
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
