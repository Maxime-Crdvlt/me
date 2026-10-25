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
        containerExperiences.innerHTML += `
        <li>
            <article class="card">
                <div class="card-title">
                    <h3>${experience.title}</h3>
                    <h4>${experience.start} - ${experience.end}</h4>
                </div>
                <p class="details">${experience.place}</p>
                <p class="card-description">${experience.description}</p>
            </article>
        </li>
        `;
    });

    skills.forEach(skill => {
        const catId = `cat-${skill.categorie_id}`;
        const typeId = `cat-${skill.categorie_id}-type-${skill.type_id}`;
        if (!document.getElementById(catId)) {
            containerSkills.innerHTML += `
                <li>
                    <article class="card">
                        <div class="card-title">
                            <h3 class="text-icon">
                                <img src="${skill.categorie_icon}" alt="">
                                <span>${skill.categorie}</span>
                            </h3>
                        </div>
                        <div class="card-description" id="${catId}"></div>
                    </article>
                </li>
            `;
        }
        if (!document.getElementById(typeId)) {
            document.getElementById(catId).innerHTML += `
                <div class="card-categorie">
                    <h4>${skill.type} :</h4>
                    <ul class="skills" id="${typeId}"></ul>
                </div>
            `;
        }
        document.getElementById(typeId).innerHTML += `
            <li class="skill">${skill.competence}</li>
        `;
    });
})