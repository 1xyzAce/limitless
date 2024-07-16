function createSnowflakes() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = '❄';
    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

let snowInterval;

function startSnowEffect() {
    snowInterval = setInterval(createSnowflakes, 200);
}

function stopSnowEffect() {
    clearInterval(snowInterval);
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach(flake => flake.remove());
}

// Start snow effect if checkbox is checked
document.getElementById('snow-toggle')?.addEventListener('change', (e) => {
    if (e.target.checked) {
        startSnowEffect();
    } else {
        stopSnowEffect();
    }
});
