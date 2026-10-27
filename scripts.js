// SELECIONA OS ELEMENTOS DO FORMULÁRIO
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const expenseList = document.querySelector("ul")

//selecione elemento de totias
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

// CAPUTURA DO EVENTO E FORMATAR O VALOR
amount.oninput = () => {
    //capturando o valor do input e removendo tudo que não for numero
    let value = amount.value.replace(/\D/g, "")
    //console.log(value)
    //transforma o valor em centavos
    value = Number(value) / 100

    //retorno para a varivel
    amount.value = formatCurrencyBRL(value)
}

//transforma o valor em moeda brasileira
function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    return value
}



//captura o evento de submit do form e obtem os valores
form.onsubmit = (event) => {
    //previne comportamento de att aut
    event.preventDefault()

    //cria um com os detalhes da nova despez
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }
    expenseAdd(newExpense)
    //limpa o form
    formClear()
}

//adição dos itens na lista
function expenseAdd(newExpense) {
    try {
        //criar o elemento pra add na lista
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // criando ícone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // criando a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // criando o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // criando a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // add nome e categoria na div, antes do item
        expenseInfo.append(expenseName, expenseCategory)

        // add o valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.replace("R$", "")}`

        //add o icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "Remover")


        // add info no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)


        //add os itens na lista
        expenseList.append(expenseItem)

        // chama a atualização de totais
        updateTotals()

    } catch (error) {
        alert('Não foi possivel atualizar a lista de despesas')
        console.log(error)
    }

}

function updateTotals() {
    try {
        //reucperar todos oe itens (li) da lista (ul)
        const items = expenseList.children
        //console.log(items)

        //att a quantidade
        expenseQuantity.textContent = `${items.length} ${items.length === 1 ? 'despesa' : 'despesas'}`
        // variave pra incrmeental o total
        let total = 0

        //percorrer cada item
        for (let item = 0; item < items.length; item++) {
            //percorre cada item (li) e busca somente a classe .expense-amount
            const itemAmount = items[item].querySelector(".expense-amount")
            //console.log(itemAmount)

            //agora pegaremos somente o valor
            const value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            //conveter o valor para float
            const valueFormatted = parseFloat(value)

            //verificar se real é um numero
            if (isNaN(valueFormatted)) {
                return alert('Não foi possivel calcula o total. O valor não parece ser um número.')
            }
            //incrementar
            total += valueFormatted
        }

        total = formatCurrencyBRL(total).replace("R$", "")
        expenseTotal.innerHTML = "<small>R$</small>"
        expenseTotal.append(total)

    } catch (error) {
        alert('Não foi possivel atualizar os totais')
    }
}

expenseList.addEventListener("click", function () {
    //console.log(event)
    if (event.target.classList.contains("remove-icon")) {
        //obter a lista pai do elemento clicando
        const item = event.target.closest(".expense")
        item.remove()
    }
    updateTotals()


})

function formClear() {
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus()
}