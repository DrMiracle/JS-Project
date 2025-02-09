const templates = require('../viewDeliveries/delTemp');
const server = require('../API');

let viewOptions = false;
let curSort = "status";
let $delList = $("#unpaid-deliveries");
let deliveries = [];
let indexToSplice;

function postInfo(error, data) {
    if (error) {
        console.log(error.toString());
    } else {
        liqpay(data);
    }
}

function liqpay(data) {

    LiqPayCheckout.init({
        data: data.data,
        signature: data.signature,
        embedTo: "#liqpay",
        mode: "popup" // embed ||popup
    }).on("liqpay.callback", function(data) {
        console.log(data.status);
        console.log(data);
        //console.log(data.index);
        deliveries[indexToSplice].paid = 'true';
        server.modifyDelivery(deliveries[indexToSplice], function (err, data) {
            if (err) {
                console.log('View Error!!!');
                console.log(err.toString());
            }
            console.log('Now remove from view');
            deliveries.splice(indexToSplice, 1);
            update();
        })
    }).on("liqpay.ready", function(data) {
        // ready
    }).on("liqpay.close", function(data){
        update();
    });
}

function initializePayments() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        $('#is-paid').css('display', 'block');
        return;
    }
    //console.log(user);
    server.getDeliveries(user, function (err, data) {
        deliveries = [];
        if (err) {
            console.log(err.toString());
        } else {
            deliveries = data;
        }
        //console.log(deliveries);
        if (deliveries.length === 0) {
            $('#is-paid').css('display', 'block');
        }
        let j = 0;
        while (j < deliveries.length) {
            if (deliveries[j].payer !== "Sender" || deliveries[j].paid === 'true') {
                deliveries.splice(j, 1);
            } else {
                j++;
            }
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
                paid: 'false',
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
        deliveries.sort(sortByStatusAsc);
        update();
    });
}

$('.slideup-for-sort').on('click', function () {
    if (!viewOptions) {
        let height = $('.slideup-for-sort').height();
        $('.slideup-for-sort').css("bottom", 8*height);
        $('.sort-item').css('visibility', 'visible');
        $('#date-pay').css("bottom", 2*height);
        $('#dest-pay').css("bottom", 4*height);
        $('#status-pay').css("bottom", 6*height);
        viewOptions = true;
    } else {
        $('.slideup-for-sort').css("bottom", "0");
        $('#date-pay').css("bottom", "0");
        $('#dest-pay').css("bottom", "0");
        $('#status-pay').css("bottom", "0");
        setTimeout(function() {
            $('.sort-item').css('visibility', 'hidden');
        }, 500);
        viewOptions = false;
    }
});

$('#date-pay').on('click', function() {
    templateToSortByOtherVal('date');
});

$('#dest-pay').on('click', function() {
    templateToSortByOtherVal('dest');
});

$('#cost-pay').on('click', function() {
    templateToSortByOtherVal('cost');
});

$('#status-pay').on('click', function() {
    templateToSortByOtherVal('status');
});

function templateToSortByOtherVal(sortBy) {
    if(curSort === sortBy) return;
    curSort = sortBy;
    if (sortBy !== "date") {
        $('#date-arrow-down-pay').css('visibility', 'hidden');
        $('#date-arrow-up-pay').css('visibility', 'hidden');
    } else {
        $('#date-arrow-down-pay').css('visibility', 'visible');
        $('#date-arrow-down-pay').css('opacity', '0.5');
        $('#date-arrow-up-pay').css('visibility', 'visible');
        $('#date-arrow-up-pay').css('opacity', '1');
    }
    if (sortBy !== "cost") {
        $('#cost-arrow-down-pay').css('visibility', 'hidden');
        $('#cost-arrow-up-pay').css('visibility', 'hidden');
    } else {
        $('#cost-arrow-down-pay').css('visibility', 'visible');
        $('#cost-arrow-down-pay').css('opacity', '0.5');
        $('#cost-arrow-up-pay').css('visibility', 'visible');
        $('#cost-arrow-up-pay').css('opacity', '1');
    }
    if (sortBy !== "dest") {
        $('#dest-arrow-down-pay').css('visibility', 'hidden');
        $('#dest-arrow-up-pay').css('visibility', 'hidden');
    } else {
        $('#dest-arrow-down-pay').css('visibility', 'visible');
        $('#dest-arrow-down-pay').css('opacity', '0.5');
        $('#dest-arrow-up-pay').css('visibility', 'visible');
        $('#dest-arrow-up-pay').css('opacity', '1');
    }
    if (sortBy !== "status") {
        $('#status-arrow-down-pay').css('visibility', 'hidden');
        $('#status-arrow-up-pay').css('visibility', 'hidden');
    } else {
        $('#status-arrow-down-pay').css('visibility', 'visible');
        $('#status-arrow-down-pay').css('opacity', '0.5');
        $('#status-arrow-up-pay').css('visibility', 'visible');
        $('#status-arrow-up-pay').css('opacity', '1');
    }
    let text = 'Delivery ';
    if (sortBy === 'date') {
        text += "Date";
        deliveries.sort(sortByDateAsc);
    }
    if (sortBy === 'dest') {
        text += "Destination";
        deliveries.sort(sortByDestinationAsc);
    }
    if (sortBy === 'cost') {
        text += "Cost";
        deliveries.sort(sortByCostAsc);
    }
    if (sortBy === 'status') {
        text += "Status";
        deliveries.sort(sortByStatusAsc);
    }
    $('.slideup-for-sort span').text(text);
    $('#main-arrow-down-pay').css('display', 'none');
    $('#main-arrow-up-pay').css('display', 'block');

    update();
}

$('#date-arrow-down-pay').on('click', function () {
    templateForArrowClick('date', 'down');
    deliveries.sort(sortByDateDesc);
    update();
});

$('#date-arrow-up-pay').on('click', function () {
    templateForArrowClick('date', 'up');
    deliveries.sort(sortByDateAsc);
    update();
});

$('#status-arrow-down-pay').on('click', function () {
    templateForArrowClick('status', 'down');
    deliveries.sort(sortByStatusDesc);
    update();
});

$('#status-arrow-up-pay').on('click', function () {
    templateForArrowClick('status', 'up');
    deliveries.sort(sortByStatusAsc);
    update();
});

$('#dest-arrow-down-pay').on('click', function () {
    templateForArrowClick('dest', 'down');
    deliveries.sort(sortByDestinationDesc);
    update();
});

$('#dest-arrow-up-pay').on('click', function () {
    templateForArrowClick('dest', 'up');
    deliveries.sort(sortByDestinationAsc);
    update();
});

$('#cost-arrow-down-pay').on('click', function () {
    templateForArrowClick('cost', 'down');
    deliveries.sort(sortByCostDesc);
    update();
});

$('#cost-arrow-up-pay').on('click', function () {
    templateForArrowClick('cost', 'up');
    deliveries.sort(sortByCostAsc);
    update();
});

function templateForArrowClick(sortBy, dir) {
    if (dir !== 'up' && dir !== 'down') return;
    let clicked = '#' + sortBy + '-arrow-down-pay';
    let opposite = '#' + sortBy + '-arrow-up-pay';
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
        $('#main-arrow-up-pay').css('display', 'block');
        $('#main-arrow-down-pay').css('display', 'none');
    } else {
        $('#main-arrow-down-pay').css('display', 'block');
        $('#main-arrow-up-pay').css('display', 'none');
    }
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

function update () {
    $delList.html("");
    let cnt = 0;
    for (let i = 0; i < deliveries.length; i++) {
        let $html_code = templates.deliveryItem({
            numId: i,
            description: deliveries[i].description,
            date: deliveries[i].date,
            cost: deliveries[i].cost,
            status: deliveries[i].status,
            fullStatus: deliveries[i].fullStatus,
            destination: deliveries[i].destination,
            fullDestination: deliveries[i].fullDestination
        });
        if (deliveries[i].paid === 'false') {
            $delList.append($html_code);
            cnt++;
        }
    }

    if (cnt === 0) {
        $('#is-paid').css('display', 'block');
        return;
    }
    let n = deliveries.length;
    for (let i = 0; i < n; i++) {
        let id = "#item" + i;
        $(id).on('click', function () {
            //console.log("id: ", id);
            let desc = "Payment info" +
                "\r\nDescription: " + deliveries[i].description +
                "\r\nDate: " + deliveries[i].date +
                "\r\nStatus: " + deliveries[i].status + '.';
            let payment_info = {
                amount: deliveries[i].cost,
                description: desc,
            };
            indexToSplice = i;
            server.createPayment(payment_info, postInfo);
        });
    }
}

exports.initializePayments = initializePayments;