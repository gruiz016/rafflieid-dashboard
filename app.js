const API = 'https://rafflleid-dashboard.herokuapp.com';

const $addItemBtn = $('#add-item');
const $addRaffleBtn = $('#add-raffle');
const $itemForm = $('.new-item-form');
const $ticketForm = $('.new-ticket-form');
const $raffleTable = $('.raffles');

$addItemBtn.on('click', (evt) => {
    evt.preventDefault();
    $itemForm.toggleClass('hide');
});

$addRaffleBtn.on('click', (evt) => {
    evt.preventDefault();
    $ticketForm.toggleClass('hide');
});

$('#submit-item').on('click', async (evt) => {
    evt.preventDefault();
    const name = $('#name').val();
    const url = $('#image').val();
    const size = $('#size').val();
    const slots = $('#slots').val();

    try {
        const response = await axios.post(`${API}/admin/products`, 
        {
            "data": {
                "name": name,
                "image": url,
                "size": size,
                "slots": +slots
            }
        })
    
        if(response.status === 201) location.reload()
        else alert('Something went wrong!')
    } catch (e) {
        alert('Something went wrong!')
    }
});

$('#submit-ticket').on("click", async (evt) => {
    evt.preventDefault();
    const tickets = $('#tickets').val();
    const $id = $('#id').val();
    const handle = $('#instagramHandle').val();
    
    try {
        const response = await axios.post(`${API}/raffles/buy/${$id}`,
        {
            "qty": tickets,
            "handle": handle
        });
        if(response.status === 201) location.reload()
        else alert('Please check product id, or IG handle and try again!')
    } catch (e) {
        alert('Please check product id, or IG handle and try again!')
        location.reload()
    }
})

const getAll = async () => {
    try {
        const response = await axios.get(`${API}/products`);
        response.data.products.forEach(async (i) => {
            const count = await axios.get(`${API}/raffles/${i.id}`)
            const $item = `
            <tr class="table-light">
                <th scope="row">${i.id}</th>
                <td>${i.name}</td>
                <td>
                    <img src="${i.image}" alt="product-image ${i.name}" class="product-img">
                </td>
                <td>${i.size}</td>
                <td>${count.data.count[0]}/${i.slots}</td>
                <td>${i.is_active}</td>
                <td><button class="btn btn-primary" data-id="${i.id}" id="disable">Delete</button></td>
                <td class="winner"><button class="btn btn-secondary" data-id="${i.id}" id="reveal">Reveal</button></td>
            </tr>
            `
            $raffleTable.append($item);
        }) 
    } catch (e) {
        alert('Something went wrong.')
    }
}

$('body').on('click', '#disable', async (evt) => {
    evt.preventDefault()
    const prodId = $(evt.target).attr("data-id");
    try {
        const response = await axios.delete(`${API}/admin/products/${prodId}`)
        if (response.data.msg === 'Deleted') location.reload()
        else alert('Something went wrong!')
    } catch (e) {
        alert('Something went wrong!')
    }
})

$('body').on('click', '#reveal', async (evt) => {
    evt.preventDefault()
    const prodId = $(evt.target).attr("data-id");
    try {
        const response = await axios.get(`${API}/raffles/winner/${prodId}`);
        $('.winner').empty()
        $('.winner').text(`${response.data.winner}`)
    } catch (e) {
        alert('Something went wrong')
    }
})

getAll();