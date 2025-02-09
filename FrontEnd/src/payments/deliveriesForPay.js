function getDeliveries() {
    let deliveries = [
        {
            description: "Some description 0",
            date: "Date 0",
            cost: 100,
            status: "Status 0",
            destination: "Destination 0"
        },
        {
            description: "Some description 1",
            date: "Date 1",
            cost: 10,
            status: "Status 1",
            destination: "Destination 1"
        },
        {
            description: "Some description 2",
            date: "Date 2",
            cost: 1,
            status: "Status 2",
            destination: "Destination 2"
        },
        {
            description: "Some description 3",
            date: "Date 3",
            cost: 200,
            status: "Status 3",
            destination: "Destination 3"
        },
        {
            description: "Some description 4",
            date: "Date 4",
            cost: 1,
            status: "Status 4",
            destination: "Destination 4"
        },
        {
            description: "Some description 5",
            date: "Date 5",
            cost: 200,
            status: "Status 5",
            destination: "Destination 5",
        }
    ];
    return deliveries;
}

exports.getDeliveries = getDeliveries;