document.addEventListener('DOMContentLoaded', async () => {
    // DATA RECOVERY
    const responseFormations = await fetch('/api/formations/getFormations.php');
    const formations = await responseFormations.json();
    const responseExperiences = await fetch('/api/experiences/getExperiences.php');
    const experiences = await responseExperiences.json();
    const responseSkills = await fetch('/api/skills/getSkills.php');
    const skills = await responseSkills.json();
    // CONTAINERS RECOVERY
    const containerFormations = document.getElementById('formations-list');
    const containerExperiences = document.getElementById('experiences-list');
    const containerSkills = document.getElementById('skills-list');

    formations.forEach(formation => {
        containerFormations.innerHTML += `
        <li>
            <article class="card">
                <div class="card-title">
                    <h3>${formation.degree}</h3>
                    <h4>${formation.start} - ${formation.end}</h4>
                </div>
                <p class="details">${formation.place}</p>
                <p class="card-description">${formation.description}</p>
            </article>
        </li>
        `;
    });

    experiences.forEach(experience => {

    });

    skills.forEach(skill => {

    });
})