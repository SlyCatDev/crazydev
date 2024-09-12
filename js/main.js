
if (document.location.pathname.includes('index.html')) {

    creativite = 3; //1
    securite = 3; //2
    confort = 3; //3

    questions = [];
    coef = [];
    critere = [];


    fetch('http://localhost:3000/questions/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json', // Pour être explicite sur ce qu'on attend en retour
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch. Status: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => { 
            data.forEach(item => {
                questions.push(item.libelle);
                coef.push(item.coef);
                critere.push(item.critere);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });




    const choices = [1, 2, 3, 4, 5];

    let currentQuestion = 0;

    const popup = document.getElementById('popup');
    const questionContainer = document.getElementById('question-container');
    const choicesContainer = document.getElementById('choices-container');
    const nextBtn = document.getElementById('next-btn');
    const startQuizBtn = document.getElementById('start-quiz');
    const closeBtn = document.querySelector('.close-btn');

    function showQuestion() {
        if (currentQuestion < questions.length) {
            questionContainer.innerHTML = `<p>${questions[currentQuestion]}</p>`;
            choicesContainer.innerHTML = `
                <div class="choice-container">
                    <span class="choice-label">Pas d'accord</span>
                    <div class="choice-inputs">
                        ${choices.map(choice => `
                            <input type="radio" name="answer" value="${choice}" id="choice${choice}">
                            <label for="choice${choice}"></label>
                        `).join('')}
                    </div>
                    <span class="choice-label">D'accord</span>
                </div>
            `;
        } else {
            questionContainer.innerHTML = '<p>Merci d\'avoir répondu à toutes les questions !</p>';
            choicesContainer.innerHTML = '';
            nextBtn.textContent = 'Terminer';
        }
    }

    nextBtn.addEventListener('click', () => {
        if (currentQuestion < questions.length) {
            const selectedAnswer = document.querySelector('input[name="answer"]:checked');
            
            if (selectedAnswer) {
                const selectedValue = selectedAnswer.value;
                point = 0;
                switch (selectedValue) {
                    case '1':
                        // pas d'acccord
                        point = (coef[currentQuestion]) - (coef[currentQuestion] * 2)
                        break;
                    case '2':
                        // pas trop d'accord
                        point = ((coef[currentQuestion]) / 2) - (((coef[currentQuestion]) / 2) *2)
                        break;
                    case '3':
                        // neutre
                        point = 0;
                        break;
                    case '4':
                        point = (coef[currentQuestion]) / 2
                        break;
                    case '5':
                        point = coef[currentQuestion]
                        break;
                    default:
                        // Default case
                        break;
                }

                switch (critere[currentQuestion]) {
                    case 1:
                        // creativite
                        creativite += point
                        break;
                    case 2:
                        //securite
                        securite += point
                        break;
                    case 3:
                        //confort
                        confort += point
                        break;
                    default:
                        // Default case
                        break;
                }
                
                currentQuestion++;
                showQuestion();
            } else {
                alert("Veuillez sélectionner une réponse avant de continuer.");
            }
        } else {
            // Fermer le popup et rediriger vers la page reponse
            if(creativite >5){
                creativite = 5;
            }else if(creativite <1){
                creativite = 1;
            }


            if(securite >5){
                securite = 5;
            }else if(securite <1){
                securite = 1;
            }


            if(confort >5){
                confort = 5;
            }else if(confort <1){
                confort = 1;
            }

            // Fait une requête fetch sur cette URL en modifiant les chiffres par des variables
            fetch('http://localhost:3000/metier/search?securite=' + securite + '&confort=' + confort + '&creativite=' + creativite)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    data.forEach(item => {
                        localStorage.setItem("metier", JSON.stringify(item));

                    });
                    popup.style.display = 'none';
                    window.location.href = 'reponse.html';
                    
                })
                .catch(error => {
                    // Gestion des erreurs du fetch
                    console.error('Fetch error:', error);
                });

            
        }
    });

    startQuizBtn.addEventListener('click', () => {
        popup.style.display = 'flex';
        currentQuestion = 0;
        showQuestion();
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });
} else if (document.location.pathname.includes('reponse.html')) {
    metier = localStorage.getItem("metier")
    metier = JSON.parse(metier);
    console.log(metier)
    document.getElementById('nom-metier').innerHTML += metier.nom
    document.getElementById('description-metier').innerHTML += metier.description

}
