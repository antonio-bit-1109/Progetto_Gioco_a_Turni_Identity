

const myValues: string[] = ["3", "ciao"]; 

for (let val of myValues) {
    console.log(val); 
}

const par = document.getElementById("par");
par !== null ? par.style.color = "blue" : null;

const all = document.querySelectorAll("p");

all.forEach(p => {
    console.log(p);
})
console.log("ciao");