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
                <th class="vocab-th">Word</th>
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
                const modal = document.createElement('div');
                modal.classList.add('vocab-modal');
                modal.innerHTML = `
                    <div class="vocab-modal-content">
                        <span class="vocab-modal-close">&times;</span>
                        <h2>${word.word}</h2>
                        <p>${word.explanation}</p>
                    </div>
                `;
                document.body.appendChild(modal);

                modal.querySelector('.vocab-modal-close').onclick = () => {
                    modal.remove();
                };
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


function fetchGrammar() {
        console.log("fetchGrammar");
}

export { fetchGrammar };

function fetchListening() {
        console.log("fetchListening");
}

export { fetchListening };

function fetchWriting() {
        console.log("fetchWriting");
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