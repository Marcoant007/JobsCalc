const { response } = require('express');
const express = require('express');
const routes = express.Router();

const views = __dirname + "/views/"

const Profile = {
    data: {
        name: "Marco Antonio",
        avatar: "https://avatars.githubusercontent.com/u/59663846?v=4",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75
    },

    controllers: {
        index(request, response) {return response.render(views + "profile", {profile: Profile.data})
        },

        update(request, response) {
            const data = request.body
            

            //definir quantas semanas tem em um ano
            const weeksPerYear = 52 

            // remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mês
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

            //total de horas trabalhadas na semana
            const weekTotalHours =  data["hours-per-day"] * data["days-per-week"]

            //horas trabalhadas no mes
            const monthlyTotalHours = weekTotalHours * weeksPerMonth

            //valor da hora
            const valueHour = data["monthly-budget"] / monthlyTotalHours
        
            Profile.data = {
                ...Profile.data,
                ...request.body,
                "value-hour": valueHour
            }

            return response.redirect('/profile')
        }

       
    }

}


const Job = {
    data: [{
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
    ],

    controllers: {
        index(request, response) {
            const updatedJobs = Job.data.map((job) => {
                const remaning = Job.services.remainingDays(job)
                const status = remaning <= 0 ? 'done' : 'progress'

                return {
                    ...job,
                    remaning,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                }
            })
            return response.render(views + "index", {
                jobs: updatedJobs
            })
        },

        create(request, response) {
            return response.render(views + "job")

        },

        save(request, response) {
            {
                const lastId = Job.data[Job.data.length - 1] ?.id || 0;

                Job.data.push({
                    id: lastId + 1,
                    name: request.body.name,
                    "daily-hours": request.body["daily-hours"],
                    "total-hours": request.body["total-hours"],
                    created_at: Date.now()
                })

                return response.redirect('/')

            }
        },
        show(request, response){
            const jobId = request.params.id 
            //procura o job, compara com o jobId que veio dos paramentos e se existir joga dentro de job
            const job = Job.data.find(job => Number(job.id) === Number(jobId))
            // se o job não existir
            if(!job){
                return response.send('Job not found')
            }
            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])
            return response.render(views + "job-edit", {job})
        },

        update(request,response){
            const jobId = request.params.id
            // dentro da data procura o id do job no array e verifica se ele é igual ao job dos paramentros
            const job = Job.data.find(job=> Number(job.id) === Number(jobId))

            if(!job){
                return response.send('Job not found')
            }

            const updatedJob = {
                ...job,
                name: request.body.name,
                "total-hours": request.body["total-hours"],
                "daily-hours": request.body["daily-hours"],
            }

            Job.data = Job.data.map(job=> {
                if(Number(job.id) === Number(jobId)){
                    job = updatedJob
                }
                console.log(job)
                return job
            })

            response.redirect('/job/' +jobId)

        },
        delete(request,response){
            jobId = request.params.id
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))


            return response.redirect('/')
        }
    },
    services: {
        remainingDays(job) {
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(remainingDays)
            const dueDateInMs = createdDate.setDate(dueDay)
            const timeDiffInMs = dueDateInMs - Date.now()
            const dayInMS = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffInMs / dayInMS)
            //restam x dias
            return dayDiff
        },
        calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
    }
}

routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);
routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);


module.exports = routes;