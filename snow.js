document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('snow')) {
        const snowflakes = document.querySelectorAll('.snowflake');
        snowflakes.forEach(snowflake => {
            snowflake.style.animation = 'fall 10s linear infinite';
        });
    }
});
