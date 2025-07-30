function handleTabNavigation(maxIndex) {
    document.addEventListener('DOMContentLoaded', () => {

        document.addEventListener("keydown", (event) => {
            if (event.key === "Tab") {
                const activeElement = document.activeElement;
                const currentIndex = parseInt(activeElement.getAttribute("tabindex"));

                if (currentIndex === maxIndex && !event.shiftKey) {
                    event.preventDefault();
                    document.querySelector('[tabindex="1"]').focus();
                }
            }
        });

    });
}

export { handleTabNavigation };

function sectionAccordionListener(event) {
    document.addEventListener('DOMContentLoaded', () => {
        const trainer = document.querySelectorAll('.trainer-section');
        const headers = document.querySelectorAll('.trainer-section-header');
        const content = document.querySelectorAll('.trainer-section-content');
        const down = document.querySelectorAll('.fas.fa-chevron-down');
        const up = document.querySelectorAll('.fas.fa-chevron-up');
        const refresh = document.querySelectorAll('.fa-solid.fa-rotate');

        const sectionInitializers = [
            fetchVocabulary,
            fetchGrammar,
            fetchListening,
            fetchWriting,
            fetchSpeaking,
            fetchMistakes,
        ];

        for (let i = 0; i < headers.length; i++) {
            headers[i].addEventListener('click', () => {
                const isVisible = !content[i].classList.contains('dn');

                for (let j = 0; j < content.length; j++) {
                    if (i !== j) {
                        content[j].classList.add('dn');
                        down[j].classList.remove('dn');
                        up[j].classList.add('dn');
                        headers[j].style.position = '';
                        headers[j].style.top = '';
                        headers[j].style.borderBottom = '';
                    }
                }

                content[i].classList.toggle('dn', isVisible);
                down[i].classList.toggle('dn', !isVisible);
                up[i].classList.toggle('dn', isVisible);

                if (refresh[i].classList.contains('dn')) {
                    refresh[i].addEventListener('click', (event) => {
                        sectionInitializers[i]();
                        event.preventDefault();
                        event.stopPropagation();
                    })
                    sectionInitializers[i]();
                }

                refresh[i].classList.remove('dn');
                headers[i].style.position = isVisible ? '' : 'sticky';
                headers[i].style.borderBottom = isVisible ? '' : '3px solid white';
                headers[i].style.top = isVisible ? '' : '0';

                if (!isVisible) {
                    trainer[i].scrollIntoView({ behavior: 'auto', block: 'start' });
                }
            });
        }

        document.getElementById("send-pass-to-email").addEventListener("click", function() {
            alert("Your password has been sent to your email.");
        });
    });
}

export { sectionAccordionListener };

function fetchVocabulary() {
    const parent = document.querySelector('#vocabulary-content');
    parent.innerHTML = '';

    const leftDivAction = document.createElement('div');
    leftDivAction.classList.add('left-vocabulary-actions');

    const rightDivTable = document.createElement('div');
    rightDivTable.classList.add('right-vocabulary-table');

    parent.appendChild(leftDivAction);
    parent.appendChild(rightDivTable);

    const wordDiv = document.createElement('div');
    wordDiv.classList.add('word-div');

    const wordInput = document.createElement('input');
    wordInput.classList.add('word-input');
    wordInput.placeholder = 'Enter word or phrase...';

    const wordExplanation = document.createElement('textarea');
    wordExplanation.classList.add('word-ta');
    wordExplanation.placeholder = 'Enter its explanation...';
    wordExplanation.style.resize = 'none';

    const aHrefHelp = document.createElement('a');
    aHrefHelp.classList.add('word-help-btn');
    aHrefHelp.innerText = 'Help';
    aHrefHelp.href = '#';

    aHrefHelp.addEventListener('click', (event) => {
        event.preventDefault();

        const word = wordInput.value.trim();
        const explanation = wordExplanation.value.trim();

        if (!word) {
            alert('Please enter a word or phrase.');
            return;
        }

        const prompt = `Please explain the word or phrase "${word}". 
            "${explanation.length === 0 ? '\n' : 'I think it means: ' + explanation + '. Is this correct? If not, provide a corrected explanation.'}".
            Also, provide:
            - Multiple meanings or contexts if applicable.
            - Example usage in dialogues or sentences.`;

            const encodedPrompt = encodeURIComponent(prompt);
            window.open(`https://www.perplexity.ai/search?q=${encodedPrompt}`, '_blank');
        });

    const addWordButton = document.createElement('button');
    addWordButton.classList.add('word-add-btn');
    addWordButton.innerText = 'Add word';

    wordDiv.appendChild(wordInput);
    wordDiv.appendChild(wordExplanation);
    wordDiv.appendChild(aHrefHelp);
    wordDiv.appendChild(addWordButton);
    leftDivAction.appendChild(wordDiv);

    const renderTable = (vocabList) => {
        rightDivTable.innerHTML = '';

        const table = document.createElement('table');
        table.classList.add('vocab-table');

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr class="vocab-header-row">
                <th class="vocab-th">Word or Phrase</th>
                <th class="vocab-th">Explanation</th>
                <th class="vocab-th">Actions</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        vocabList.forEach(word => {
            const row = document.createElement('tr');
            row.classList.add('vocab-row');

            const wordCell = document.createElement('td');
            wordCell.classList.add('vocab-td');
            wordCell.innerText = word.word;

            const explanationCell = document.createElement('td');
            explanationCell.classList.add('vocab-td');
            explanationCell.innerText = word.explanation;

            const actionsCell = document.createElement('td');
            actionsCell.classList.add('vocab-td');

            const trainBtn = document.createElement('button');
            trainBtn.classList.add('vocab-train-btn');
            trainBtn.innerText = 'Train';

            trainBtn.onclick = () => {
                let repeatCount = 0;
                const phrase = `${word.word} - ${word.explanation}`;
                let currentIndex = 0;
                let mistakes = 0;
                let totalMistakes = 0;
                let consecutiveMistakes = 0;
                let correctedMistakes = 0;
                let sessionStartTime = null;
                let proMode = false;
                let requiredRepeats = 1;
                let isFocused = true;
                let timerInterval;
                let hasStarted = false;
                let totalTime = 0;
                let wasIncorrectBefore = [];
                let attemptTimes = [];
                let attemptNumber = 0;

                document.body.style.overflow = 'hidden';

                const modal = document.createElement('div');
                modal.classList.add('vocab-modal');
                Object.assign(modal.style, {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'sans-serif',
                });

                modal.innerHTML = `
        <div id="modal-header" style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; background: #f0f0f0; border-bottom: 2px solid #ccc; font-size: 20px;">
            <div>
                <strong>WPM:</strong> <span id="wpm">0</span> |
                <strong>Accuracy:</strong> <span id="accuracy">100%</span> |
                <strong>Real Accuracy:</strong> <span id="real-accuracy">100%</span> |
                <strong>Repeats Left:</strong> <span id="repeats-left">1</span> |
                <strong>Attempt:</strong> <span id="attempt-number">0</span> |
                <strong>Timer:</strong> <span id="timer">0.0s</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <label style="font-size: 18px;"><input type="checkbox" id="pro-mode" style="transform: scale(1.5); margin-right: 5px;" /> Pro Mode</label>
                <input id="repeat-count" type="number" value="1" min="1" style="width: 60px; font-size: 18px; padding: 5px;" />
                <button id="apply-repeats" style="font-size: 18px; padding: 6px 12px;">Apply</button>
                <button id="close-modal" style="font-size: 24px; padding: 6px 12px;">&times;</button>
            </div>
        </div>
        <div id="typing-content" style="flex-grow: 1; display: flex; align-items: center; justify-content: center; font-size: 36px; font-family: monospace; padding: 40px;">
            <div id="text-wrapper" style="display: flex; flex-wrap: wrap; gap: 2px;"></div>
        </div>
    `;

                document.body.appendChild(modal);

                const closeModal = () => {
                    clearInterval(timerInterval);
                    document.removeEventListener('keydown', handleTyping);
                    window.removeEventListener('focus', onFocus);
                    window.removeEventListener('blur', onBlur);
                    modal.remove();
                    document.body.style.overflow = '';
                };

                const wpmEl = document.getElementById('wpm');
                const accuracyEl = document.getElementById('accuracy');
                const realAccuracyEl = document.getElementById('real-accuracy');
                const repeatInput = document.getElementById('repeat-count');
                const textWrapper = document.getElementById('text-wrapper');
                const proModeToggle = document.getElementById('pro-mode');
                const applyBtn = document.getElementById('apply-repeats');
                const repeatsLeftEl = document.getElementById('repeats-left');
                const timerEl = document.getElementById('timer');
                const attemptNumberEl = document.getElementById('attempt-number');
                document.getElementById('close-modal').onclick = closeModal;

                let charSpans = [];

                const updateTimer = () => {
                    if (sessionStartTime && isFocused && hasStarted) {
                        const elapsed = ((Date.now() - sessionStartTime + totalTime) / 1000).toFixed(1);
                        timerEl.textContent = `${elapsed}s`;
                    }
                };

                const onFocus = () => isFocused = true;
                const onBlur = () => isFocused = false;
                window.addEventListener('focus', onFocus);
                window.addEventListener('blur', onBlur);

                const resetTrainer = () => {
                    currentIndex = 0;
                    mistakes = 0;
                    correctedMistakes = 0;
                    consecutiveMistakes = 0;
                    hasStarted = false;
                    wasIncorrectBefore = [];

                    textWrapper.innerHTML = '';
                    charSpans = phrase.split('').map((char, i) => {
                        const span = document.createElement('span');
                        span.dataset.index = i;
                        span.textContent = char === ' ' ? '\u00A0' : char;
                        Object.assign(span.style, {
                            padding: '6px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                        });
                        textWrapper.appendChild(span);
                        return span;
                    });
                    updateCursor();
                };

                const updateStats = () => {
                    const totalElapsed = (Date.now() - sessionStartTime + totalTime) / 60000;
                    const wpm = totalElapsed > 0 ? Math.round(((phrase.length * repeatCount) / 5) / totalElapsed) : 0;
                    const total = currentIndex + mistakes;
                    const acc = total > 0 ? Math.round((currentIndex / total) * 100) : 100;
                    const realTotal = phrase.length * parseInt(repeatInput.value);
                    const realAcc = Math.max(0, 100 - Math.floor((totalMistakes / realTotal) * 100));
                    wpmEl.textContent = wpm;
                    accuracyEl.textContent = `${acc}%`;
                    realAccuracyEl.textContent = `${realAcc}%`;
                };

                const updateCursor = () => {
                    charSpans.forEach(span => span.style.borderBottom = 'none');
                    const current = charSpans[currentIndex];
                    if (current) current.style.borderBottom = '2px solid black';
                };

                const handleTyping = (e) => {
                    if (!hasStarted && e.key.length === 1) {
                        hasStarted = true;
                        sessionStartTime = Date.now();
                        clearInterval(timerInterval);
                        timerInterval = setInterval(updateTimer, 100);
                    }

                    if (e.key === ' ' || e.key === 'Backspace') e.preventDefault();

                    if (e.key === 'Backspace') {
                        if (currentIndex > 0) {
                            currentIndex--;
                            const span = charSpans[currentIndex];
                            if (span.style.backgroundColor === 'red') {
                                wasIncorrectBefore[currentIndex] = true;
                            }
                            span.style.backgroundColor = 'transparent';
                            updateCursor();
                        }
                        return;
                    }

                    if (e.key.length !== 1 || currentIndex >= phrase.length) return;

                    const expected = phrase[currentIndex];
                    const span = charSpans[currentIndex];
                    const wasIncorrect = span.style.backgroundColor === 'red' || span.style.backgroundColor === 'yellow' || wasIncorrectBefore[currentIndex];

                    if ((expected === ' ' && e.key === ' ') || e.key === expected) {
                        if (wasIncorrect) {
                            span.style.backgroundColor = 'yellow';
                            correctedMistakes++;
                        } else {
                            span.style.backgroundColor = 'green';
                        }
                        currentIndex++;
                        consecutiveMistakes = 0;
                    } else {
                        totalMistakes++;
                        span.style.backgroundColor = 'red';
                        wasIncorrectBefore[currentIndex] = true;
                        mistakes++;
                        consecutiveMistakes++;
                        currentIndex++;
                        if (proMode || consecutiveMistakes >= 5) {
                            if (proMode && hasStarted && sessionStartTime) {
                                attemptTimes.push(Date.now() - sessionStartTime);
                                attemptNumber++;
                                attemptNumberEl.textContent = attemptNumber;
                            }
                            resetTrainer();
                            return;
                        }
                    }

                    updateStats();
                    updateCursor();

                    if (currentIndex === phrase.length) {
                        repeatCount++;
                        requiredRepeats--;
                        repeatsLeftEl.textContent = requiredRepeats;
                        const elapsed = Date.now() - sessionStartTime;
                        totalTime += elapsed;
                        attemptTimes.push(elapsed);
                        attemptNumber++;
                        attemptNumberEl.textContent = attemptNumber;
                        hasStarted = false;

                        if (requiredRepeats <= 0) {
                            clearInterval(timerInterval);
                            const totalElapsed = (totalTime / 1000).toFixed(1);
                            alert(`Completed!\nWPM: ${wpmEl.textContent}\nAccuracy: ${accuracyEl.textContent}\nReal Accuracy: ${realAccuracyEl.textContent}\nTime: ${totalElapsed}s\nRepeats: ${repeatInput.value}\nAttempts: ${attemptNumber}`);
                            closeModal();
                        } else {
                            resetTrainer();
                        }
                    }
                };

                proModeToggle.addEventListener('change', () => {
                    proMode = proModeToggle.checked;
                });

                applyBtn.addEventListener('click', () => {
                    requiredRepeats = parseInt(repeatInput.value);
                    repeatsLeftEl.textContent = requiredRepeats;
                    repeatCount = 0;
                    totalTime = 0;
                    sessionStartTime = null;
                    attemptTimes = [];
                    attemptNumber = 0;
                    attemptNumberEl.textContent = attemptNumber;
                    clearInterval(timerInterval);
                    resetTrainer();
                });

                document.addEventListener('keydown', handleTyping);
                resetTrainer();
            };


            const removeBtn = document.createElement('button');
            removeBtn.classList.add('vocab-remove-btn');
            removeBtn.innerText = 'Remove';
            removeBtn.onclick = () => {
                if (confirm('Are you sure you want to remove this word?')) {
                    fetch(`/vocabulary/${word.id}`, {
                        method: 'DELETE'
                    })
                        .then(response => {
                            if (response.ok) {
                                loadVocabulary();
                            } else {
                                alert('Failed to remove word.');
                            }
                        });
                }
            };

            actionsCell.appendChild(trainBtn);
            actionsCell.appendChild(removeBtn);

            row.appendChild(wordCell);
            row.appendChild(explanationCell);
            row.appendChild(actionsCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        rightDivTable.appendChild(table);
    };

    const loadVocabulary = () => {
        fetch('/vocabulary')
            .then(response => response.json())
            .then(data => renderTable(data));
    };

    addWordButton.onclick = () => {
        const word = wordInput.value.trim();
        const explanation = wordExplanation.value.trim();

        if (!word || !explanation) {
            alert('Both fields must be filled out.');
            return;
        }

        const newWord = {
            word: word,
            explanation: explanation,
            language: 'ENGLISH'
        };

        fetch('/vocabulary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newWord)
        })
            .then(response => {
                if (response.ok) {
                    wordInput.value = '';
                    wordExplanation.value = '';
                    loadVocabulary();
                } else {
                    alert('Failed to add word.');
                }
            })
            .catch(error => {
                alert('Error while adding word.');
                console.error(error);
            });
    };

    loadVocabulary();
}


export { fetchVocabulary };

let grammarData = [];

function fetchGrammar() {
    const grammarContent = document.getElementById('grammar-content');
    grammarContent.innerHTML = '';

    const headerGrammarContent = document.createElement('div');
    grammarContent.appendChild(headerGrammarContent);

    // Create Inputs & Buttons
    const grammarRuleName = createInput('Enter grammar rule name...');
    const grammarRuleHtml = createInput('Rule explanation in HTML format...');
    const findRule = createInput('Enter grammar rule name to filter table...');

    const grammarHelpBtn = createButton('Help', async () => {
        if (!grammarRuleName.value) return alert('Please enter rule name for help!');
        const prompt = `Create an adaptive HTML table explaining the grammar rule: "${grammarRuleName.value}", with sample usages. 
            All explanation and content must be in HTML only, wrapped in a single outer <div> tag. 
            All styles must be inline (using the style attribute directly in HTML). 
            Do not use any CSS classes or external stylesheets. 
            The layout should be responsive and readable on all screen sizes.`;

        window.open(`https://chat.openai.com/?model=gpt-4&prompt=${encodeURIComponent(prompt)}`, '_blank');
    });

    const grammarAddBtn = createButton('Add', () => {
        const name = grammarRuleName.value.trim();
        const html = grammarRuleHtml.value.trim();
        if (!name || !html) return alert('Both rule name and explanation must be provided!');
        fetch('/grammar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ruleName: name, ruleExplanation: html, language: "ENGLISH" }) // adjust as needed
        }).then(() => {
            grammarRuleName.value = '';
            grammarRuleHtml.value = '';
            loadGrammarTable();
        });
    });

    const findBtn = createButton('Find', () => filterTable(findRule.value.trim()));
    const resetBtn = createButton('Reset', () => {
        findRule.value = '';
        loadGrammarTable();
    });

    // Assemble header
    [grammarRuleName, grammarRuleHtml, grammarHelpBtn, grammarAddBtn, findRule, findBtn, resetBtn]
        .forEach(el => headerGrammarContent.appendChild(el));

    // Table container
    const tableContainer = document.createElement('div');
    tableContainer.id = 'grammar-table-container';
    grammarContent.appendChild(tableContainer);

    // Modal for displaying HTML
    createModal();

    loadGrammarTable();
}

function createInput(placeholder) {
    const input = document.createElement('input');
    input.placeholder = placeholder;
    input.classList.add('grammar-input');
    return input;
}

function createButton(text, handler) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.classList.add('grammar-button');
    btn.onclick = handler;
    return btn;
}

function loadGrammarTable() {
    fetch('/grammar')
        .then(res => res.json())
        .then(data => {
            grammarData = data;
            renderTable(grammarData);
        });
}

function renderTable(data) {
    const container = document.getElementById('grammar-table-container');
    container.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'grammar-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Grammar Rule</th>
            <th>Actions</th>
        </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(rule => {
        const row = document.createElement('tr');

        const ruleNameCell = document.createElement('td');
        ruleNameCell.textContent = rule.ruleName;

        const actionsCell = document.createElement('td');
        actionsCell.appendChild(createButton('Show', () => showModal(rule.ruleExplanation)));
        actionsCell.appendChild(createButton('Train', () => {
            const prompt = `Create a quiz with 10 random
             questions for the grammar rule: "${rule.ruleName}". 
             Explanation:\n${rule.ruleExplanation}. Ignore Html code to full extent.
             Provide 10 questions that are related to the grammar rule.
             Provide for each question 4 variants of correct answer. As numbered list (1,2,3,4).
             Next prompt I will send you 10 numbers.
             Evaluate my answers and say where I was wrong and why.
             After this evaluation request whether to continue such quiz with new 10 questions or not until I stop it. 
             `;
            window.open(`https://chat.openai.com/?model=gpt-4&prompt=${encodeURIComponent(prompt)}`, '_blank');
        }));
        actionsCell.appendChild(createButton('Remove', () => {
            fetch(`/grammar/${rule.id}`, { method: 'DELETE' })
                .then(() => loadGrammarTable());
        }));

        row.appendChild(ruleNameCell);
        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

function filterTable(keyword) {
    if (!keyword) return renderTable(grammarData);
    const filtered = grammarData.filter(rule =>
        rule.ruleName.toLowerCase().includes(keyword.toLowerCase())
    );
    renderTable(filtered);
}

function createModal() {
    const modal = document.createElement('div');
    modal.id = 'grammar-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="document.getElementById('grammar-modal').style.display='none'">&times;</span>
            <div id="modal-body"></div>
        </div>`;
    document.body.appendChild(modal);
}

function showModal(htmlContent) {
    document.getElementById('modal-body').innerHTML = htmlContent;
    document.getElementById('grammar-modal').style.display = 'block';
}



export { fetchGrammar };

function fetchListening() {
    const listeningParent = document.getElementById('listening-content');

    // Clear previous content
    listeningParent.innerHTML = '';

    // Create notice span for TTS plugin info
    const noticeSpan = document.createElement('span');
    noticeSpan.innerText = 'Please ensure you have a text-to-speech plugin installed for audio playback.';
    noticeSpan.classList.add('listening-alert');

    // Create input
    const queryInput = document.createElement('input');
    queryInput.setAttribute('type', 'text');
    queryInput.setAttribute('placeholder', 'Enter a theme for the listening exercise...');
    queryInput.classList.add('listening-input');

    // Create button-like anchor
    const queryLink = document.createElement('a');
    queryLink.innerText = 'Generate Listening Exercise';
    queryLink.href = '#';
    queryLink.classList.add('listening-button');

    // Click handler
    queryLink.onclick = (e) => {
        e.preventDefault();
        const theme = queryInput.value.trim();
        if (!theme) {
            alert('Please enter a theme to continue.');
            return;
        }

        const gptQuery = `
            Create an IELTS-style listening exercise based on the theme provided in the variable "${theme}". Choose the most appropriate format among the following based on the theme: 
            1) university lecture, 
            2) a conversation between two people, or 
            3) a monologue.
            
            Step 1: Generate a natural, native-level English listening script (approximately 250–300 words) with a mix of advanced but common vocabulary for non-native speakers.
            
            Step 2: Based on the script, generate a quiz with 10 fill-in-the-blank questions. Each question should be a short phrase with one or two key missing words. Format each question as plain text, numbered, with the blank indicated (e.g., “He was ___ to the event.”). Do not include answers yet.
            
            Step 3: Wait for the user to submit their answers in the format: beginning of the phrase with the missing word(s) included. Then, compare the user’s answers with the correct ones, providing feedback for each:
            - If correct: acknowledge
            - If incorrect: show correct word(s), suggest synonyms, and give a usage example
            
            At the end of the feedback, ask the user: “Would you like to generate a second text?”
        `;

        window.open(`https://chat.openai.com/?model=gpt-4&prompt=${encodeURIComponent(gptQuery)}`, '_blank');

    };

    // Append elements to parent in order
    listeningParent.appendChild(noticeSpan);
    listeningParent.appendChild(queryInput);
    listeningParent.appendChild(queryLink);
}


export { fetchListening };

function fetchWriting() {
        let writingPrompt = `
            I need to create a prompt for the case when I will send to chatGpt text from writing exercise and I need that chat checked it for grammar mistakes , and for styling mistakes (using obsolete words or not used words) or failed grammar for some cases etc... and provided for me this mistakes as list
        `;
}

export { fetchWriting };

function fetchSpeaking() {
        console.log("fetchSpeaking");
}

export { fetchSpeaking };

function fetchMistakes() {
        console.log("fetchMistakes");
}

export { fetchMistakes };

function showAppModal(name, html) {
        console.log("show modal");

}

export { showAppModal };