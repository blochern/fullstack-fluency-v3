console.log("Script.js file working successfully");

const div = document.querySelector("div");

fetch("/icecream")
    .then((data) => data.json())
    .then((results) => {
        console.log(results);
        const ol = document.createElement('ol');
        for (let index in results) {
            const li = document.createElement('li');
            li.textContent = results[index].name;
            ol.appendChild(li);
        }
        div.appendChild(ol);
    });