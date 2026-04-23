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
    const DELAY_MINUTES = 13;
    const DELAY_SECONDS = 30;
    const TOTAL_DELAY_MS = ((DELAY_MINUTES * 60) + DELAY_SECONDS) * 1000;

    const delayedOffer = document.getElementById('delayed-offer');
    if (delayedOffer) {
        // Fallback básico para liberar caso a pessoa saia da aba ou video travar (usa relógio)
        let fallbackTimer = setTimeout(() => {
            delayedOffer.style.display = 'flex';
        }, TOTAL_DELAY_MS);

        // Tentativa de Sincronizar com o VTurb exatamente (caso o usuario pause)
        const SECONDS_TO_DISPLAY = (DELAY_MINUTES * 60) + DELAY_SECONDS;
        const checkVTurb = setInterval(() => {
            try {
                if (window.smartplayer && window.smartplayer.instances && window.smartplayer.instances[0]) {
                    const videoTime = window.smartplayer.instances[0].video.currentTime;
                    if (videoTime >= SECONDS_TO_DISPLAY) {
                        delayedOffer.style.display = 'flex';
                        clearTimeout(fallbackTimer);
                        clearInterval(checkVTurb);
                    }
                }
            } catch (e) { }
        }, 1000);
    }
});
