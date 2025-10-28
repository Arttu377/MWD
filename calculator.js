// Calculator JavaScript
// Hide loading screen
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Ensure loading is visible on entry for at least a brief moment
        setTimeout(function() {
            loadingScreen.classList.add('hidden');
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 300);
        }, 250);
    }
});

document.addEventListener("DOMContentLoaded", function() {

    // Questions data
    const questions = [
        {
            id: 'pages',
            title: 'Sivuston koko / sisältö',
            description: 'Kuinka monta sivua haluat?',
            type: 'radio',
            options: [
                { value: '1-3', label: '1-3 sivua', description: 'Kevyt sivusto - esimerkiksi yhden sivun "yhteenvetosivu" (etusivu, palvelut ja yhteystiedot samassa)', price: 0 },
                { value: '4-7', label: '4-7 sivua', description: 'Perussivusto - etusivu + 2-4 palvelusivua + yhteystiedot ja mahdollinen "meistä"-osio', price: 160 },
                { value: '8+', label: '8+ sivua', description: 'Laaja sivusto - yrityksen sivusto, jossa on useita palveluita, blogi, referenssit, uutiset tai kieliversiot', price: 400 }
            ]
        },
        {
            id: 'subpages',
            title: 'Alisivut ja lisäosat',
            description: 'Tarvitaanko alisivuja, blogia tai uutisosiota?',
            type: 'radio',
            options: [
                { value: 'none', label: 'Ei tarvita', description: 'Vain perussivut', price: 0 },
                { value: 'blog', label: 'Blogi', description: 'Blogi-ominaisuudet sivustolle', price: 240 },
                { value: 'news', label: 'Uutisosio', description: 'Uutisosio sivustolle', price: 200 },
                { value: 'both', label: 'Molemmat', description: 'Blogi ja uutisosio', price: 400 }
            ]
        },
        {
            id: 'design',
            title: 'Design ja räätälöinti',
            description: 'Haluatko valmiin teeman vai täysin räätälöidyn ulkoasun?',
            type: 'radio',
            options: [
                { value: 'template', label: 'Valmis teema', description: 'Mukautettu valmis teema', price: 0 },
                { value: 'custom', label: 'Räätälöity design', description: 'Täysin yksilöllinen ulkoasu', price: 320 },
                { value: 'branding', label: 'Brändäys + design', description: 'Logo, värit, fontit + räätälöity design', price: 640 }
            ]
        },
        {
            id: 'functions',
            title: 'Toiminnot ja integraatiot',
            description: 'Mitä toimintoja sivustosi tarvitsee?',
            type: 'checkbox',
            options: [
                { value: 'none', label: 'Ei tarvita', description: 'Vain perussivut ilman erityistoimintoja', price: 0 },
                { value: 'contact', label: 'Yhteydenottolomake', description: 'Perus lomake sähköpostin lähettämiseen', price: 80 },
                { value: 'booking', label: 'Tilauslomake', description: 'Ajanvaraus tai tilausjärjestelmä', price: 160 },
                { value: 'map', label: 'Kartta', description: 'Google Maps integraatio', price: 40 },
                { value: 'payment', label: 'Maksut / verkkokauppa', description: 'Verkkokauppa ja maksujärjestelmä', price: 480 },
                { value: 'users', label: 'Käyttäjätilit', description: 'Rekisteröityminen ja kirjautuminen', price: 240 },
                { value: 'social', label: 'Sosiaalisen median integraatio', description: 'Facebook, Instagram, Twitter yhteys', price: 120 },
                { value: 'newsletter', label: 'Uutiskirje', description: 'Uutiskirjeen tilausjärjestelmä', price: 160 }
            ]
        },
        {
            id: 'content',
            title: 'Sisällöntuotanto',
            description: 'Tuotetaanko tekstit, kuvat ja videot sinun puolestasi?',
            type: 'radio',
            options: [
                { value: 'provided', label: 'Toimitetaan valmiina', description: 'Sisältö toimitetaan valmiina', price: 0 },
                { value: 'text', label: 'Tekstien tuotanto', description: 'Tekstien kirjoittaminen', price: 160 },
                { value: 'images', label: 'Kuvien tuotanto', description: 'Kuvien ottaminen ja käsittely', price: 240 },
                { value: 'video', label: 'Videoiden tuotanto', description: 'Videoiden tuotanto ja editointi', price: 400 },
                { value: 'full', label: 'Täydellinen sisällöntuotanto', description: 'Tekstit, kuvat ja videot', price: 640 }
            ]
        },
        {
            id: 'seo',
            title: 'Hakukoneoptimointi (SEO)',
            description: 'Mitä tasoa hakukoneoptimointiin tarvitset? Huomaa: Perusoptimointi (tekninen SEO ja perusasetukset) sisältyy perushintaan.',
            type: 'radio',
            options: [
                { value: 'basic', label: 'Perusoptimointi (sisältyy)', description: 'Tekninen SEO ja perusasetukset - sisältyy perushintaan', price: 0 },
                { value: 'advanced', label: 'Laajempi SEO', description: 'Avainsanatyö ja sisällön optimointi', price: 240 },
                { value: 'comprehensive', label: 'Kattava SEO-strategia', description: 'Täydellinen SEO-analyysi ja toteutus', price: 480 }
            ]
        },
        {
            id: 'email',
            title: 'Yhteystiedot',
            description: 'Anna sähköpostiosoitteesi, jotta voin tarvittaessa tarkentaa tarjousta.',
            type: 'email',
            placeholder: 'esimerkki@email.com'
        }
    ];

    // State management
    let currentStep = 0;
    let answers = {};
    let totalPrice = 300; // Base price (includes basic SEO optimization)

    // DOM elements
    const questionContainer = document.getElementById('questionContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const priceAmount = document.getElementById('priceAmount');
    const priceBreakdown = document.getElementById('priceBreakdown');
    const restartBtn = document.getElementById('restartBtn');

    // Initialize calculator
    function initCalculator() {
        renderQuestion();
        updateProgress();
        updateNavigation();
    }

    // Render current question
    function renderQuestion() {
        const question = questions[currentStep];
        
        let html = `
            <div class="question active">
                <h3>${question.title}</h3>
                <p>${question.description}</p>
        `;

        if (question.type === 'radio') {
            html += '<div class="options-container">';
            question.options.forEach(option => {
                const isSelected = answers[question.id] === option.value ? 'selected' : '';
                html += `
                    <div class="option ${isSelected}" data-value="${option.value}">
                        <input type="radio" name="${question.id}" value="${option.value}" id="${question.id}_${option.value}">
                        <label class="option-label" for="${question.id}_${option.value}">
                            ${option.label}
                        </label>
                        <div class="option-description">${option.description}</div>
                    </div>
                `;
            });
            html += '</div>';
        } else if (question.type === 'checkbox') {
            html += '<div class="options-container">';
            question.options.forEach(option => {
                const isSelected = answers[question.id] && answers[question.id].includes(option.value) ? 'selected' : '';
                html += `
                    <div class="option ${isSelected}" data-value="${option.value}">
                        <input type="checkbox" name="${question.id}" value="${option.value}" id="${question.id}_${option.value}">
                        <label class="option-label" for="${question.id}_${option.value}">
                            ${option.label}
                        </label>
                        <div class="option-description">${option.description}</div>
                    </div>
                `;
            });
            html += '</div>';
        } else if (question.type === 'email') {
            html += `
                <div class="email-input-container">
                    <input type="email" class="email-input" id="emailInput" placeholder="${question.placeholder}" value="${answers[question.id] || ''}">
                    <div class="error-message" id="emailError">Anna kelvollinen sähköpostiosoite</div>
                </div>
            `;
        }

        html += '</div>';
        questionContainer.innerHTML = html;

        // Add event listeners
        if (question.type === 'radio') {
            document.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    this.querySelector('input').checked = true;
                    answers[question.id] = this.dataset.value;
                    updateNavigation();
                });
            });
        } else if (question.type === 'checkbox') {
            document.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', function() {
                    const checkbox = this.querySelector('input');
                    checkbox.checked = !checkbox.checked;
                    
                    if (checkbox.checked) {
                        this.classList.add('selected');
                    } else {
                        this.classList.remove('selected');
                    }
                    
                    // Update answers array
                    if (!answers[question.id]) {
                        answers[question.id] = [];
                    }
                    
                    if (checkbox.checked) {
                        if (!answers[question.id].includes(option.dataset.value)) {
                            answers[question.id].push(option.dataset.value);
                        }
                    } else {
                        answers[question.id] = answers[question.id].filter(val => val !== option.dataset.value);
                    }
                    
                    updateNavigation();
                });
            });
        } else if (question.type === 'email') {
            const emailInput = document.getElementById('emailInput');
            emailInput.addEventListener('input', function() {
                answers[question.id] = this.value;
                updateNavigation();
            });
        }
    }

    // Update progress bar
    function updateProgress() {
        const progress = ((currentStep + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Kysymys ${currentStep + 1} / ${questions.length}`;
    }

    // Update navigation buttons
    function updateNavigation() {
        const question = questions[currentStep];
        let canProceed = false;

        if (question.type === 'email') {
            const email = answers[question.id] || '';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            canProceed = emailRegex.test(email);
        } else if (question.type === 'checkbox') {
            canProceed = answers[question.id] && answers[question.id].length > 0;
        } else {
            canProceed = answers[question.id] !== undefined;
        }

        nextBtn.disabled = !canProceed;
        nextBtn.style.opacity = canProceed ? '1' : '0.5';
        nextBtn.style.cursor = canProceed ? 'pointer' : 'not-allowed';

        prevBtn.style.display = currentStep > 0 ? 'block' : 'none';
    }

    // Calculate total price
    function calculatePrice() {
        let price = 300; // Base price
        let breakdown = [];

        questions.forEach(question => {
            if (question.type === 'email') return;

            const answer = answers[question.id];
            if (!answer) return;

            if (question.type === 'radio') {
                const option = question.options.find(opt => opt.value === answer);
                if (option && option.price > 0) {
                    price += option.price;
                    breakdown.push({
                        label: option.label,
                        price: option.price
                    });
                }
            } else if (question.type === 'checkbox') {
                answer.forEach(value => {
                    const option = question.options.find(opt => opt.value === value);
                    if (option && option.price > 0) {
                        price += option.price;
                        breakdown.push({
                            label: option.label,
                            price: option.price
                        });
                    }
                });
            }
        });

        return { price, breakdown };
    }

    // Show results
    function showResults() {
        const { price, breakdown } = calculatePrice();
        
        questionContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        
        // Hide navigation buttons
        document.querySelector('.navigation-buttons').style.display = 'none';
        
        priceAmount.textContent = `${price}€`;
        
        let breakdownHtml = '<h4>Hinnan koostumus:</h4>';
        breakdownHtml += '<div class="price-item"><span class="price-item-label">Perushinta</span><span class="price-item-value">300€</span></div>';
        
        breakdown.forEach(item => {
            breakdownHtml += `<div class="price-item"><span class="price-item-label">${item.label}</span><span class="price-item-value">+${item.price}€</span></div>`;
        });
        
        breakdownHtml += `<div class="price-item"><span class="price-item-label">Yhteensä</span><span class="price-item-value">${price}€</span></div>`;
        
        priceBreakdown.innerHTML = breakdownHtml;
    }

    // Next button click
    nextBtn.addEventListener('click', function() {
        if (currentStep < questions.length - 1) {
            currentStep++;
            renderQuestion();
            updateProgress();
            updateNavigation();
        } else {
            showResults();
        }
    });

    // Previous button click
    prevBtn.addEventListener('click', function() {
        if (currentStep > 0) {
            currentStep--;
            renderQuestion();
            updateProgress();
            updateNavigation();
        }
    });

    // Restart button click
    restartBtn.addEventListener('click', function() {
        currentStep = 0;
        answers = {};
        totalPrice = 300;
        
        questionContainer.style.display = 'block';
        resultsContainer.style.display = 'none';
        
        // Show navigation buttons again
        document.querySelector('.navigation-buttons').style.display = 'flex';
        
        renderQuestion();
        updateProgress();
        updateNavigation();
    });

    // Initialize the calculator
    initCalculator();
});
