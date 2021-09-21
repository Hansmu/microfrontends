import faker from 'faker';

const mountContent = (el) => {
    const cartText = `<div>You have ${faker.random.number()} items in our cart</div>`;

    el.innerHTML = cartText;
};

export {mountContent};