let data = [{
        id: 1,
        name: "Pizzaria",
        "daily-hours": 2,
        "total-hours": 1,
        created_at: Date.now(),
    },
    {
        id: 2,
        name: "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now(),
    }
];

module.exports = {
    getData(){
        return data
    },
    update(newJob){
        data = newJob
    },
    delete(id){
        data = data.filter(job => Number(job.id) !== Number(jobId))
    }
}