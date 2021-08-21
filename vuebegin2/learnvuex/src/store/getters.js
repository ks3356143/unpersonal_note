export default {
    powerCounter(state){
        return state.counter * state.counter 
    },
    selectstudent(state){
        let student = []
        for(let i of state.students){
            if(i.age >= 20)
            student.push(i.name)
        }
        return student
    },
    more20age(state){
        return state.students.filter(s => s.age >= 20)
    },
    more20age1(state,getters){
        return getters.more20age.length
    },
    moreAgestu(state){
        return (age) => {
            return state.students.filter(s => s.age >= age)
        }
    },
}