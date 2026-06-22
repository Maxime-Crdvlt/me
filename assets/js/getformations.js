document.addEventListener('DOMContentLoaded', () => {
    // RECUPERATION DES DONNEES
    const formations = fetch('api/getFormations.php');

    //TRAITEMENT
    if (formations.length === 0) {
        document.body.append('<p>Aucune formation trouvée dans la base de données.</p>');
        return;
    } else {
        formations.forEach(formation => {
            const formHTML = `
            <form class="formation" id="formation-${formation.id}">
                <div>
                    <label for="diplome">Diplôme</label>
                    <input type="text" id="diplome-${formation.id}" name="diplome" value="${formation.degree}" required />
                </div>
                <div>
                    <div>
                        <label for="date-debut">Début</label>
                        <input type="date" id="date-debut-${formation.id}" name="date-debut" value="${formation.start}" required />
                    </div>
                    <div>
                        <label for="date-fin">Fin</label>
                        <input type="date" id="date-fin-${formation.id}" name="date-fin" value="${formation.end}" required />
                    </div>
                </div>
                <div>
                    <label for="place">Lieu</label>
                    <input type="text" id="place-${formation.id}" name="place" value="${formation.place}" required />
                </div>
                <div>
                    <label for="description">Description</label>
                    <textarea type="text" id="description-${formation.id}" name="description" value="${formation.description}" required></textarea>
                </div>
            </form>
            `
            document.body.main.append(formHTML);
        });
    }
})