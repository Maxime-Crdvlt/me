document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('button-nav');
    const icon = document.getElementById('icon-button-nav');
    const nav = document.getElementById('nav');

    button.addEventListener('click', (event) => {
        if (nav.classList.contains('nav-hidden')) {
            nav.classList.add('nav-visible');
            nav.classList.remove('nav-hidden');
            icon.classList.add('fi-br-cross');
            icon.classList.remove('fi-br-menu-burger');
        } else {
            nav.classList.add('nav-hidden');
            nav.classList.remove('nav-visible');
            icon.classList.add('fi-br-menu-burger');   
            icon.classList.remove('fi-br-cross');       
        }
    })
})