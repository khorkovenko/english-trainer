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
        You are an English writing assistant. A learner will input a written text (50–250 words) that may include grammar issues, awkward style, or uncommon/non-native phrasing. 

        Your task is to:
        1. Read the text carefully and identify grammar mistakes, unnatural or outdated phrases, or anything that doesn't sound like how a native speaker would express the idea.
        2. For each issue, provide:
           - A brief explanation (no more than 3 sentences) about *why* it's incorrect or unnatural.
           - Advice on how to think about this mistake to avoid it in the future.
        3. Then, rewrite:
           - Only the problematic sentence(s) if there are just a few issues.
           - Or the entire text if there are many issues throughout.
        4. At the end, provide a final version rewritten in smooth, natural English.

        5. Finally, estimate how this writing might score on an IELTS writing band scale (1–9) and briefly justify that score.

        Structure your output as follows:

        **Mistakes and Explanations**
        1. [Quote the original sentence or phrase]
           - Explanation: [...]
           - How to think differently: [...]

        2. [Repeat for each issue]

        **Corrected Sentences**
        - [Only rewrite the sentences that were changed]

        **Full Native Speaker Version**
        [Provide a clean, natural rewrite of the full text, in a native tone.]

        **Estimated IELTS Band Score**
        Band: [score] - [reason]
    `;

    const writingParent = document.getElementById('writing-content');
    writingParent.innerHTML = '';
    const container = document.createElement('div');
    container.classList.add('writing-container');

    const header = document.createElement('h4');
    header.style.color = '#ffffff';
    header.style.marginBottom = '10px';
    header.style.fontSize = '1.1rem';
    header.innerText = 'Choose word count and time limit. Then write about any topic that interests you.';
    container.appendChild(header);

    const topControls = document.createElement('div');
    topControls.id = 'top-controls';

    const controlsWrapper = document.createElement('div');
    controlsWrapper.style.display = 'flex';
    controlsWrapper.style.gap = '10px';
    controlsWrapper.style.marginBottom = '12px';
    controlsWrapper.style.flexWrap = 'wrap';

    const createSelect = (labelText, options, defaultVal) => {
        const wrapper = document.createElement('div');
        const label = document.createElement('label');
        label.innerText = labelText;
        label.style.color = 'white';
        label.style.display = 'block';

        const select = document.createElement('select');
        options.forEach(optVal => {
            const opt = document.createElement('option');
            opt.value = optVal;
            opt.innerText = optVal === 'unlimited' ? 'Unlimited' : `${optVal}${labelText.includes('Time') ? ' sec' : ' words'}`;
            select.appendChild(opt);
        });
        select.value = defaultVal;
        select.classList.add('writing-select');
        wrapper.appendChild(label);
        wrapper.appendChild(select);
        return { wrapper, select };
    };

    const wordOptions = ['unlimited', 50, 100, 150, 200, 250];
    const timeOptions = ['unlimited', 120, 240, 360, 480, 600];

    const { wrapper: wordWrapper, select: wordsLimit } = createSelect('Word Count', wordOptions, 'unlimited');
    const { wrapper: timeWrapper, select: timeLimit } = createSelect('Time Limit', timeOptions, 'unlimited');

    controlsWrapper.appendChild(wordWrapper);
    controlsWrapper.appendChild(timeWrapper);

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = '12px';
    buttonRow.style.marginBottom = '12px';

    const topicBtn = document.createElement('a');
    topicBtn.innerText = 'Find a Good IELTS Topic';
    topicBtn.href = 'https://gemini.google.com/app?q=Good+IELTS+writing+task+2+topic+with+graph+description+and+generate+bar+image';
    topicBtn.target = '_blank';
    topicBtn.classList.add('writing-button');

    const startBtn = document.createElement('a');
    startBtn.innerText = 'Start Writing';
    startBtn.href = '#';
    startBtn.classList.add('writing-button');

    buttonRow.appendChild(startBtn);
    buttonRow.appendChild(topicBtn);

    topControls.appendChild(controlsWrapper);
    topControls.appendChild(buttonRow);
    container.appendChild(topControls);

    const writingSection = document.createElement('div');
    writingSection.style.display = 'none';

    const textInput = document.createElement('textarea');
    textInput.setAttribute('placeholder', 'Paste or type your writing...');
    textInput.classList.add('writing-textarea');
    textInput.disabled = true;

    const wordCountDisplay = document.createElement('div');
    wordCountDisplay.style.marginTop = '8px';
    wordCountDisplay.style.fontSize = '0.9rem';
    wordCountDisplay.innerText = 'Words: 0';
    wordCountDisplay.style.color = 'red';

    const timerDisplay = document.createElement('div');
    timerDisplay.style.marginTop = '12px';
    timerDisplay.style.marginBottom = '12px';
    timerDisplay.style.fontSize = '0.9rem';
    timerDisplay.style.color = 'white';
    timerDisplay.style.display = 'none';

    writingSection.appendChild(textInput);
    writingSection.appendChild(wordCountDisplay);
    writingSection.appendChild(timerDisplay);

    const submitBtn = document.createElement('a');
    submitBtn.innerText = 'Check My Writing';
    submitBtn.href = '#';
    submitBtn.classList.add('writing-button');

    let timerInterval;
    let timeLeft;

    function updateWordCount() {
        const words = textInput.value.trim().split(/\s+/).filter(Boolean);
        const limit = wordsLimit.value;

        if (limit !== 'unlimited') {
            const limitVal = parseInt(limit);
            if (words.length < limitVal) {
                wordCountDisplay.style.color = 'red';
            } else {
                wordCountDisplay.style.color = 'limegreen';
            }
            wordCountDisplay.innerText = `${words.length} out of ${limitVal}`;
        } else {
            wordCountDisplay.innerText = `Words: ${words.length}`;
            wordCountDisplay.style.color = 'limegreen';
        }
    }

    textInput.addEventListener('input', updateWordCount);

    startBtn.onclick = (e) => {
        e.preventDefault();
        textInput.disabled = false;
        writingSection.style.display = 'block';
        const top = document.getElementById('top-controls');
        if (top) top.style.display = 'none';
        updateWordCount();

        if (timerInterval) clearInterval(timerInterval);
        if (timeLimit.value !== 'unlimited') {
            timeLeft = parseInt(timeLimit.value);
            timerDisplay.style.display = 'block';
            timerDisplay.innerText = `Time left: ${timeLeft}s`;
            timerInterval = setInterval(() => {
                timeLeft--;
                timerDisplay.innerText = `Time left: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    textInput.disabled = true;
                    submitBtn.click();
                }
            }, 1000);
        } else {
            timerDisplay.style.display = 'none';
        }
    };

    submitBtn.onclick = (e) => {
        e.preventDefault();
        const text = textInput.value.trim();
        const words = text.split(/\s+/).filter(Boolean);
        const limit = wordsLimit.value;

        if (limit !== 'unlimited' && words.length < parseInt(limit)) {
            alert(`Your text has only ${words.length} words. Minimum required: ${limit}.`);
            return;
        }

        if (limit !== 'unlimited' && words.length > parseInt(limit) + 10) {
            alert(`Your text has ${words.length} words. Please keep it within ${parseInt(limit) + 10} words.`);
            return;
        }

        const fullPrompt = `${writingPrompt}\n\nUser Text:\n"${text}"`;
        window.open(`https://chat.openai.com/?model=gpt-4&prompt=${encodeURIComponent(fullPrompt)}`, '_blank');
    };

    writingSection.appendChild(submitBtn);
    container.appendChild(writingSection);
    writingParent.appendChild(container);
}


export { fetchWriting };

function fetchSpeaking() {
    const speakingParent = document.getElementById('speaking-content');
    speakingParent.innerHTML = '';

    // Warmup section container
    const warmupSection = document.createElement('div');
    warmupSection.className = 'warmup-section';

    // Header
    const header = document.createElement('div');
    header.className = 'warmup-header';
    header.textContent = '🟡 Warmup: Practice speaking English on a theme of your choice';

    // Input
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter a theme for the conversation...';
    input.className = 'theme-input';

    // Start ChatGPT Button
    const chatBtn = document.createElement('button');
    chatBtn.textContent = 'Start Conversation';
    chatBtn.className = 'start-chat-btn';

    chatBtn.onclick = () => {
        const theme = input.value.trim();
        if (!theme) {
            alert('Please define a theme before starting the conversation.');
            return;
        }

        const chatPrompt = `
You are an IELTS Speaking examiner. The theme will be passed as a string argument. Use it to guide the conversation as follows:

1. Structure the test in 3 parts:
   - Part 1: Ask 3 general introductory questions, loosely based on the theme if suitable.
   - Part 2: Give one cue card task related to the theme. After the user responds, ask one simple follow-up question.
   - Part 3: Ask 3 more abstract or opinion-based questions based on the theme.

2. After each question, wait for the user to say "next" before continuing.

3. After each response, give feedback in three parts:
   - Mistakes in grammar or vocabulary (with corrections)
   - Pronunciation and clarity issues (assume user is speaking English even with a strong accent)
   - Suggestions to sound more native (e.g., natural phrasing, idioms, tone)

4. After giving feedback, ask: “Would you like to continue to the next question?”

5. If the user says “no,” end the session by summarizing:
   - A list of all mistakes made throughout the test
   - Suggestions for improvement
   - An estimated IELTS Speaking band score based on performance

Always keep the tone professional and clear.

Theme: ${theme}
    `.trim();

        const encodedPrompt = encodeURIComponent(chatPrompt);
        window.open(`https://chat.openai.com/?model=gpt-4&prompt=${encodedPrompt}`, '_blank');
    };

    // Help with Theme Button
    const helpBtn = document.createElement('button');
    helpBtn.textContent = 'Help with theme';
    helpBtn.className = 'help-theme-btn';

    helpBtn.onclick = () => {
        const theme = input.value.trim();
        const query = encodeURIComponent(`Better IELTS speaking theme idea based on: ${theme}`);
        window.open(`https://www.perplexity.ai/search?q=${query}`, '_blank');
    };

    // Links Section
    const linksSection = document.createElement('div');
    linksSection.className = 'links-section';

    const links = [
        ['Speak & Improve', 'https://speakandimprove.com'],
        ['Speaking Club', 'https://speakingclub.com'],
        ['Free4Talk', 'https://www.free4talk.com'],
        ['HiLoKal', 'https://www.hilokal.com/en/speak/English'],
        ['SmallTalk2.me', 'https://smalltalk2.me'],
        ['Gliglish', 'https://gliglish.com'],
        ['Duolingo', 'https://www.duolingo.com'],
        ['HelloTalk', 'https://www.hellotalk.com']
    ];

    links.forEach(([name, url]) => {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = name;
        link.className = 'speaking-link';
        linksSection.appendChild(link);
    });

    // Assemble
    warmupSection.appendChild(header);
    warmupSection.appendChild(input);
    warmupSection.appendChild(chatBtn);
    warmupSection.appendChild(helpBtn);
    warmupSection.appendChild(linksSection);

    speakingParent.appendChild(warmupSection);
}


export { fetchSpeaking };

function fetchMistakes() {
        const mistakesParent = document.getElementById('mistakes-content');
        mistakesParent.innerHTML = '';

}

export { fetchMistakes };
