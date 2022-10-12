// форматирование сумм: разделитель нулей, значок валюты
const formatCurrency = (num) => {
    const currency = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
    });
    return currency.format(num);
};


const navigationLinks = document.querySelectorAll('.navigation__link');
const calcElems = document.querySelectorAll('.calc');

// чтобы не зависело от порядка в вёрстке
navigationLinks.forEach((linkClick) => {
    linkClick.addEventListener('click', (event) => {
        event.preventDefault();
        navigationLinks.forEach(link => {
            if (linkClick === link) {
                link.classList.add('navigation__link_active');
            } else {
                link.classList.remove('navigation__link_active');
            }
        })
        calcElems.forEach((item) => {
            if (linkClick.dataset.tax === item.dataset.tax) {
                item.classList.add('calc_active');
            } else {
                item.classList.remove('calc_active');
            }
        });
    });
});

// for (let i = 0; i < navigationLinks.length; i++) {
//     navigationLinks[i].addEventListener('click', (e) => {
//         e.preventDefault();
//         for (let j = 0; j < calcElems.length; j++) {
//             if (navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
//                 calcElems[j].classList.add('calc_active');
//                 navigationLinks[j].classList.add('navigation__link_active');
//             } else {
//                 calcElems[j].classList.remove('calc_active');
//                 navigationLinks[j].classList.remove('navigation__link_active');
//             }
//         }
//     });
// }

// форма ausn
const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resultTaxTotal = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');
calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', () => {
    if (formAusn.type.value === 'income') {
        calcLabelExpenses.style.display = 'none';
        resultTaxTotal.textContent = formatCurrency(formAusn.income.value * 0.08);
        formAusn.expenses.value = '';
    }
    if (formAusn.type.value === 'expenses') {
        calcLabelExpenses.style.display = ''; //декларативно возвращаем стили
        resultTaxTotal.textContent = formatCurrency(
            (formAusn.income.value - formAusn.expenses.value) * 0.2);
    }
});

// форма самозанятый
const selfEmployment = document.querySelector('.self-employment');
const formSelf = selfEmployment.querySelector('.calc__form');
const resultTaxTotalSelf = selfEmployment.querySelector('.result__tax_total');
const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');

const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation');
const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation');
const resultTaxResult = selfEmployment.querySelector('.result__tax_result');

const checkCompensation = () => {
    const setDisplay = formSelf.addCompensation.checked ? '' : 'none';
    calcCompensation.style.display = setDisplay;
    resultBlockCompensation.forEach(item => item.style.display = setDisplay);
    // if (formSelf.addCompensation.checked === true) {
    //     calcCompensation.style.display = '';
    // } else {
    //     calcCompensation.style.display = 'none';
    // }
};

checkCompensation();
// calcCompensation.style.display = 'none';

formSelf.addEventListener('input', () => {
    const personTaxSelf = formSelf.person.value * 0.04;
    const entityTaxSelf = formSelf.entity.value * 0.06;
    checkCompensation();

    const tax = personTaxSelf + entityTaxSelf
    // проверка на 10 000
    formSelf.compensation.value =
        formSelf.compensation.value > 10_000 ?
            10_000 :
            formSelf.compensation.value;

    const benefit = formSelf.compensation.value;
    const resultBenefit = formSelf.person.value * 0.01 +
        formSelf.entity.value * 0.02;
    const finalBenefit = (benefit - resultBenefit) > 0 ?
        (benefit - resultBenefit) : 0;
    const finalTax = tax - (benefit - finalBenefit);


    resultTaxTotalSelf.textContent = formatCurrency(tax);
    resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
    resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
    resultTaxResult.textContent = formatCurrency(finalTax);

})


