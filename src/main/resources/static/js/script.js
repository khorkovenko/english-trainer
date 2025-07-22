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
    wordExplanation.style.resize = 'none';
    wordExplanation.placeholder = 'Enter its explanation...';
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