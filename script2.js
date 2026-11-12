let sections = ["sectionLaws", "sectionInterestGroup"]
function show(id) {
    for (section of sections) {
        document.getElementById(section).style.display = "none"
    }
    document.getElementById(id).style.display = "grid"
}

const groups = {
    "Armed Forces": "#ab946c",
    "Devout": "#4c9f70",
    "Industrialists": "#e98e3c",
    "Intelligentsia": "#ffda6d",
    "Landowners": "#9c85f3",
    "Petite bourgeoisie": "#5b9ee1",
    "Rural Folk": "#7abe43",
    "Trade Unions": "#c64e4a",
    "Inactive": "#a0a0a0"
}

const professions = {
    "Academic": [0, 0, 0, 250, 0, 0, 0, 0, 0],
    "Aristocrat": [5, 0, 0, 0, 250, 0, 0, 0, 0],
    "Bureaucrat": [0, 0, 0, 150, 0, 0, 0, 0, 0],
    "Capitalist": [0, 0, 250, 50, 0, 0, 0, 0, 0],
    "Clergyperson": [0, 250, 0, 0, 50, 0, 0, 0, 0],
    "Clerk": [0, 0, 0, 50, 0, 75, 0, 35, 0],
    "Engineer": [0, 0, 50, 0, 0, 50, 0, 0, 0],
    "Farmer": [0, 0, 0, 0, 25, 0, 200, 0, 0],
    "Laborer": [0, 0, 0, 0, 0, 0, 0, 50, 0],
    "Machinist": [0, 0, 0, 0, 0, 0, 0, 150, 0],
    "Officer": [250, 0, 0, 0, 25, 0, 0, 0, 0],
    "Peasant": [0, 100, 0, 0, 0, 0, 200, 0, 0],
    "Serviceperson": [100, 0, 0, 0, 0, 0, 0, 25, 0],
    "Shopkeeper": [0, 0, 25, 0, 0, 150, 0, 0, 0],
    "Slave": [0, 0, 0, 0, 0, 0, 0, 0, 1],
    "Unemployed": [0, 0, 0, 0, 0, 0, 0, 0, 1]
}

let selectedProfession = "Unemployed"
const getAJob = document.getElementById("getAJob")
for (const profession in professions) {
    const professionButton = document.createElement("button")
    professionButton.classList.add("professionButton")
    professionButton.innerHTML = `<img src="./icons/professions/${profession}.png">${profession}`
    professionButton.addEventListener("click", () => selectProfession(profession))
    professionButton.id = profession
    getAJob.appendChild(professionButton)
}

function selectProfession(profession) {
    document.getElementById(selectedProfession).style.border = ""
    selectedProfession = profession
    document.getElementById(profession).style.border = "solid 2px #f0f0e0"
    generatePieChart()
}
selectProfession(selectedProfession)

function generatePieChart() {
    const chart = document.getElementById("pieChart")
    const icons = document.getElementById("pieIcons")
    const centerIcon = document.getElementById("pieCenterIcon")
    const centerName = document.getElementById("pieCenterName")
    const center = document.getElementById("pieCenter")
    const ratios = professions[selectedProfession]
    const total = ratios.reduce((sum, ratio) => sum + ratio, 0)
    let gradient = []
    let percentage = 0
    icons.innerHTML = ""

    if (total === 0) {
        chart.style.background = "#808080"
        center.style.display = "none"
        return
    }

    center.style.display = "flex"

    const largest = Object.entries(groups)
        .map(([name], i) => ({ name, ratio: ratios[i] }))
        .sort((a, b) => b.ratio - a.ratio || a.name.localeCompare(b.name))[0]

    centerIcon.src = `./icons/groups/${largest.name}.png`
    centerName.textContent = `${largest.name} (${(largest.ratio / total * 100).toFixed(1)}%)`

    const radius = chart.offsetWidth * 0.436

    Object.entries(groups).forEach(([name, color], i) => {
        const share = ratios[i] / total * 100
        const nextPercentage = percentage + share

        gradient.push(`${color} ${percentage}% ${nextPercentage}%`)

        if (share >= 10) {
            const radians = (percentage + nextPercentage) / 2 * 3.6 * Math.PI / 180 - Math.PI / 2

            const icon = document.createElement("img")
            icon.src = `./icons/groups/${name}.png`
            icon.alt = name
            icon.title = name
            icon.style.left = `${chart.offsetWidth / 2 + Math.cos(radians) * radius}px`
            icon.style.top = `${chart.offsetHeight / 2 + Math.sin(radians) * radius}px`

            icons.appendChild(icon)
        }

        percentage = nextPercentage
    })

    chart.style.background = `conic-gradient(${gradient.join(", ")})`
}
show("sectionInterestGroup")
generatePieChart()