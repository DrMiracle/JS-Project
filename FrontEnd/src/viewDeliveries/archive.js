const templates = require('./delTemp');
const deliveriesList = require('./deliveriesList');
const serverInteract = require('../API');

let viewOptions = false;
let curSort = "status";
let $delList = $("#add-deliveries");
let deliveries;
let newDescription = "";
let payerChanged = false;
let modifyInd = -1;

function initializeArchive() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        $('#is-empty').css('display', 'block');
        return;
    }
    //console.log(user);
    serverInteract.getDeliveries(user, function (err, data) {
        deliveries = [];
        if (err) {
            console.log(err.toString());
            return;
        } else {
            deliveries = data;
        }
        //console.log(deliveries);
        if (deliveries.length === 0) {
            $('#is-empty').css('display', 'block');
        }
        for (let i = 0; i < deliveries.length; i++) {
            deliveries[i] = {
                id: deliveries[i].id,
                description: deliveries[i].description ? deliveries[i].description : "No description",
                date: deliveries[i].date ? deliveries[i].date.slice(0, 10) : "No Date",
                cost: deliveries[i].cost,
                status: deliveries[i].status ? deliveries[i].status : "No Status",
                destination: deliveries[i].destination,
                fullStatus: deliveries[i].status ? deliveries[i].status : "No Status",
                fullDestination: deliveries[i].destination,
                payer: deliveries[i].payer,
                paid: deliveries[i].paid,
                name: deliveries[i].name,
                surname: deliveries[i].surname,
                phone: deliveries[i].phone
            }
            if(deliveries[i].status.length > 12) {
                deliveries[i].status = deliveries[i].status.substring(0, 9);
                deliveries[i].status += "...";
            }
            if(deliveries[i].destination.length > 14) {
                deliveries[i].destination = deliveries[i].destination.substring(0, 11);
                deliveries[i].destination += "...";
            }
        }
        if (deliveries) deliveries.sort(sortByStatusAsc);
        updateArchive();
    });
}

$('.slideup-for-sort').on('click', function () {
    if (!viewOptions) {
        let height = $('.slideup-for-sort').height();
        $('.slideup-for-sort').css("bottom", 8*height);
        $('.sort-item').css('visibility', 'visible');
        $('#date').css("bottom", 2*height);
        $('#dest').css("bottom", 4*height);
        $('#status').css("bottom", 6*height);
        viewOptions = true;
    } else {
        $('.slideup-for-sort').css("bottom", "0");
        $('#date').css("bottom", "0");
        $('#dest').css("bottom", "0");
        $('#status').css("bottom", "0");
        setTimeout(function() {
            $('.sort-item').css('visibility', 'hidden');
        }, 500);
        viewOptions = false;
    }
});

$('#date').on('click', function() {
    templateToSortByOtherVal('date');
});

$('#dest').on('click', function() {
    templateToSortByOtherVal('dest');
});

$('#cost').on('click', function() {
    templateToSortByOtherVal('cost');
});

$('#status').on('click', function() {
    templateToSortByOtherVal('status');
});

$('#date-arrow-down').on('click', function () {
    templateForArrowClick('date', 'down');
    if (deliveries) deliveries.sort(sortByDateDesc);
    updateArchive();
});

$('#date-arrow-up').on('click', function () {
    templateForArrowClick('date', 'up');
    if (deliveries) deliveries.sort(sortByDateAsc);
    updateArchive();
});

$('#status-arrow-down').on('click', function () {
   templateForArrowClick('status', 'down');
    if (deliveries) deliveries.sort(sortByStatusDesc);
    updateArchive();
});

$('#status-arrow-up').on('click', function () {
    templateForArrowClick('status', 'up');
    if (deliveries) deliveries.sort(sortByStatusAsc);
    updateArchive();
});

$('#dest-arrow-down').on('click', function () {
    templateForArrowClick('dest', 'down');
    if (deliveries) deliveries.sort(sortByDestinationDesc);
    updateArchive();
});

$('#dest-arrow-up').on('click', function () {
    templateForArrowClick('dest', 'up');
    if (deliveries) deliveries.sort(sortByDestinationAsc);
    updateArchive();
});

$('#cost-arrow-down').on('click', function () {
    templateForArrowClick('cost', 'down');
    if (deliveries) deliveries.sort(sortByCostDesc);
    updateArchive();
});

$('#cost-arrow-up').on('click', function () {
    templateForArrowClick('cost', 'up');
    if (deliveries) deliveries.sort(sortByCostAsc);
    updateArchive();
});

function templateForArrowClick(sortBy, dir) {
    if (dir !== 'up' && dir != 'down') return;
    let clicked = '#' + sortBy + '-arrow-down';
    let opposite = '#' + sortBy + '-arrow-up';
    if(dir === 'up') {
        let temp = clicked;
        clicked = opposite;
        opposite = temp;
    }
    if($(clicked).css('opacity') === '1') {
        return;
    }
    $(clicked).css('opacity', '1');
    $(opposite).css('opacity', '0.5');
    if (dir === 'up') {
        $('#main-arrow-up').css('display', 'block');
        $('#main-arrow-down').css('display', 'none');
    } else {
        $('#main-arrow-down').css('display', 'block');
        $('#main-arrow-up').css('display', 'none');
    }
}

function templateToSortByOtherVal(sortBy) {
    if(curSort === sortBy) return;
    curSort = sortBy;
    if (sortBy !== "date") {
        $('#date-arrow-down').css('visibility', 'hidden');
        $('#date-arrow-up').css('visibility', 'hidden');
    } else {
        $('#date-arrow-down').css('visibility', 'visible');
        $('#date-arrow-down').css('opacity', '0.5');
        $('#date-arrow-up').css('visibility', 'visible');
        $('#date-arrow-up').css('opacity', '1');
    }
    if (sortBy !== "cost") {
        $('#cost-arrow-down').css('visibility', 'hidden');
        $('#cost-arrow-up').css('visibility', 'hidden');
    } else {
        $('#cost-arrow-down').css('visibility', 'visible');
        $('#cost-arrow-down').css('opacity', '0.5');
        $('#cost-arrow-up').css('visibility', 'visible');
        $('#cost-arrow-up').css('opacity', '1');
    }
    if (sortBy !== "dest") {
        $('#dest-arrow-down').css('visibility', 'hidden');
        $('#dest-arrow-up').css('visibility', 'hidden');
    } else {
        $('#dest-arrow-down').css('visibility', 'visible');
        $('#dest-arrow-down').css('opacity', '0.5');
        $('#dest-arrow-up').css('visibility', 'visible');
        $('#dest-arrow-up').css('opacity', '1');
    }
    if (sortBy !== "status") {
        $('#status-arrow-down').css('visibility', 'hidden');
        $('#status-arrow-up').css('visibility', 'hidden');
    } else {
        $('#status-arrow-down').css('visibility', 'visible');
        $('#status-arrow-down').css('opacity', '0.5');
        $('#status-arrow-up').css('visibility', 'visible');
        $('#status-arrow-up').css('opacity', '1');
    }
    let text = 'Delivery ';
    if (sortBy === 'date') {
        text += "Date";
        if (deliveries) deliveries.sort(sortByDateAsc);
    }
    if (sortBy === 'dest') {
        text += "Destination";
        if (deliveries) deliveries.sort(sortByDestinationAsc);
    }
    if (sortBy === 'cost') {
        text += "Cost";
        if (deliveries) deliveries.sort(sortByCostAsc);
    }
    if (sortBy === 'status') {
        text += "Status";
        if (deliveries) deliveries.sort(sortByStatusAsc);
    }
    $('.slideup-for-sort span').text(text);
    $('#main-arrow-down').css('display', 'none');
    $('#main-arrow-up').css('display', 'block');

    updateArchive();
}

function sortByStatusAsc(delivery1, delivery2) {
    if (delivery1.status < delivery2.status) return -1;
    else if (delivery1.status === delivery2.status) return 0;
    else return 1;
}

function sortByStatusDesc(delivery1, delivery2) {
    return -sortByStatusAsc(delivery1, delivery2);
}

function sortByDestinationAsc(delivery1, delivery2) {
    if (delivery1.destination < delivery2.destination) return -1;
    else if (delivery1.destination === delivery2.destination) return 0;
    else return 1;
}

function sortByDestinationDesc(delivery1, delivery2) {
    return -sortByDestinationAsc(delivery1, delivery2);
}

function sortByDateAsc(delivery1, delivery2) {
    if (delivery1.date < delivery2.date) return -1;
    else if (delivery1.date === delivery2.date) return 0;
    else return 1;
}

function sortByDateDesc(delivery1, delivery2) {
    return -sortByDateAsc(delivery1, delivery2);
}

function sortByCostAsc(delivery1, delivery2) {
    if (delivery1.cost < delivery2.cost) return -1;
    else if (delivery1.cost === delivery2.cost) return 0;
    else return 1;
}

function sortByCostDesc(delivery1, delivery2) {
    return -sortByCostAsc(delivery1, delivery2);
}

function updateArchive () {
    $delList.html("");
    if (!deliveries) return;
    for (let i = 0; i < deliveries.length; i++) {
        let html_code = templates.deliveryItem({
            numId: -(i + 1),
            description: deliveries[i].description,
            date: deliveries[i].date,
            cost: deliveries[i].cost,
            status: deliveries[i].status,
            fullStatus: deliveries[i].fullStatus,
            destination: deliveries[i].destination,
            fullDestination: deliveries[i].fullDestination
        });
        $delList.append($(html_code));
    }

    let n = deliveries.length;
    for (let i = 0; i < n; i++) {
        let id = "#item-" + (i + 1);
        let curDel = $(id);
        curDel.attr('data-toggle', 'modal');
        curDel.attr('data-target', '#delivery-info');
        curDel.on('click', function () {
            if (deliveries[i].paid === 'true') {
                $('#modal-payer').css('cursor', 'auto');
            } else {
                $('#modal-payer').css('cursor', 'pointer');
            }
            newDescription = "";
            payerChanged = false;
            modifyInd = i;
            $('#modify-delivery').css('display', 'none');
            $('#change-description').css('display', 'none');
            $('#modal-description').css('display', 'inline');
            $('#modal-payer').css('display', 'inline');

            $('#modal-description').text(deliveries[i].description);
            $('#modal-destination').text(deliveries[i].destination);
            $('#modal-date').text(deliveries[i].date);
            $('#modal-cost').text(deliveries[i].cost);
            $('#modal-status').text(deliveries[i].status);
            $('#modal-receiver').text(deliveries[i].name + ' ' + deliveries[i].surname);
            $('#modal-phone').text(deliveries[i].phone);
            $('#modal-payer').text(deliveries[i].payer);
            $('#modal-paid').text(deliveries[i].paid === 'true' ? 'Yes' : 'No');
        });
    }
}

$('#modal-description').on('click', function () {
    $('#change-description').attr('placeholder', deliveries[modifyInd].description);
    $('#change-description').css('display', 'inline');
    $('#change-description').focus();
    $('#modal-description').css('display', 'none');
    $('#modify-delivery').css('display', 'flex');
});

$('#change-description').on('focusout', function () {
    newDescription = $('#change-description').val();
    if (newDescription && newDescription.length > 0) {
        $('#modal-description').text(newDescription);
    } else if (!payerChanged) {
        $('#modify-delivery').hide();
    }
    $('#change-description').css('display', 'none');
    $('#modal-description').css('display', 'inline');
});

$('#modal-payer').on('click', function () {
    if (deliveries[modifyInd].paid === 'true') {
        return;
    }
    let payer = $(this).text();
    if (payer === "Sender") {
        $('#modal-payer').text("Receiver");
    } else {
        $('#modal-payer').text("Sender");
    }
    payerChanged = !payerChanged;
    if (payerChanged) {
        $('#modify-delivery').css('display', 'flex');
    } else if (!newDescription || newDescription.length === 0) {
        $('#modify-delivery').css('display', 'none');
    }
});

$('#modify-delivery').on('click', function () {
    let modifyNeeded = false;
    if (newDescription.length > 0) {
        deliveries[modifyInd].description = newDescription;
        modifyNeeded = true;
    }
    if (payerChanged) {
        modifyNeeded = true;
        if (deliveries[modifyInd].payer === "Sender") {
            deliveries[modifyInd].payer = "Receiver";
        } else {
            deliveries[modifyInd].payer = "Sender";
        }
    }
    if (!modifyNeeded) {
        return;
    }
    $('#delivery-info').modal('hide');
    serverInteract.modifyDelivery(deliveries[modifyInd], function (err) {
        if (err) {
            console.log(err.toString());
        }
        updateArchive();
    })
});

$('#delivery-info').on('hide.bs.modal', function () {
    updateArchive();
})

$('[data-toggle="tooltip"]').tooltip();

exports.initializeArchive = initializeArchive;