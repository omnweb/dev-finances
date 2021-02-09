const Modal = {
    open() {
        //Abrir modal adicionando a classe active
        document.querySelector('.modal-overlay').classList.add('active')
        document.querySelector('.legend').innerHTML = 'Entrada / Saída'
    },
    close() {
        // Fecha o modal removendo a classe active
        document.querySelector('.modal-overlay.active').classList.remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('dev.finances.transaction')) || []
    },
    set(transaction) {
        localStorage.setItem("dev.finances.transaction", JSON.stringify(transaction))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)
        setTimeout(() => App.reload(), 200)
    },
    incomes() {
        let income = 0
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income
    },
    expenses() {
        let expense = 0
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense
    },

    total() {
        // entradas - saídas
        let total = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0)
                total += transaction.amount
            else
                total += transaction.amount
        })
        return total;
    },
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction, index) {
        const CssClass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        const html = ` 
            <tr>
                <td class="description">${transaction.description}</td>
                <td class="${CssClass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img class="icon" onClick="Transaction.remove(${index})" src="./assets//minus.svg" alt="Remover Transação">
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

        if (Transaction.total(transaction) === 0) {
            document.querySelector('.total').style.backgroundColor = '#ccc';
        } else if (Transaction.total(transaction) < 0) {
            document.querySelector('.total').style.background = 'rgb(233, 41, 41)';
        } else {
            document.querySelector('.total').style.background = 'rgb(73, 170, 38)';
        }

    },
    clearTransaction() {
        DOM.transactionContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = value * 100
        return Math.round(value)
    },
    formatDate(date) {
        const splitDate = date.split("-")
        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        // console.log(signal + value)
        return signal + value
    }

}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateFields() {
        const { description, amount, date } = Form.getValues()
        if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
            throw new Error(`Todos os campos são obrigatórios.`)
        }
    },
    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return { description, amount, date }

    },
    clearFields() {
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },
    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()

        } catch (error) {
            const err = document.querySelector('.legend')
            err.innerHTML = `<span class="form-error">${error.message}</span>`
        }

    }
}


const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransaction()
        App.init()
    }
}

App.init()




