const Job = require('../model/Job');
const JobUtils = require('../utils/jobUtils');
const Profile = require('../model/Profile');
module.exports = {
    index(request, response) {
        const jobs = Job.getData()
        const profile = Profile.get()

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        let jobTotalHours = 0

        //o map percorre cada job e retorna o valor 
        const updatedJobs = jobs.map((job) => {
            //verifica o status do job
            const remaning = JobUtils.remainingDays(job)
            //chama a função quantos dias faltam
            const status = remaning <= 0 ? 'done' : 'progress';
            // se 0 for maior ou igual a remaning retornar done, se não progress.


            statusCount[status] += 1;
            
            if(status == 'progress'){
                jobTotalHours += Number(job['daily-hours'])
            }
            

            return {
                ...job,
                remaning, 
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
                //aqui retornar todos os dados do job + remaning + status + budget.
            }
        })
        const freeHours = profile["hours-per-day"] - jobTotalHours;
        
        return response.render("index", {
            jobs: updatedJobs,
            profile: profile,
            statusCount: statusCount,
            freeHours: freeHours
        })

    }
}