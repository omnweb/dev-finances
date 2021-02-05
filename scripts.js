const Modal = {
    open() {
        //Abrir modal adicionando a classe active
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        // Fecha o modal removendo a classe active
        document.querySelector('.modal-overlay.active').classList.remove('active')
    }
}

const transaction = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '05/02/2021'
    },
    {
        id: 2,
        description: 'Criação Websiter',
        amount: 500000,
        date: '05/02/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -25000,
        date: '05/02/2021'
    }

]

const Transaction = {
    incomes() {
        let income = 0
        transaction.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income
    },
    expenses() {
        let expense = 0
        transaction.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense
    },

    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}
const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        DOM.transactionContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction) {
        const CssClass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        const html = ` 
            <tr>
                <td class="description">${transaction.description}</td>
                <td class="${CssClass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img src="./assets//minus.svg" alt="Remover Transação">
                </td>
            </tr>
        `
        return html
    },
    updateBalance() {
        document
            .querySelector("#incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .querySelector("#expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .querySelector("#totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total())
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        // console.log(signal + value)
        return signal + value
    }

}

transaction.forEach((transaction) => {
    DOM.addTransaction(transaction)
})

DOM.updateBalance()



