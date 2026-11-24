let sections = ["sectionLaws", "sectionInterestGroup"]
function show(id) {
    for (section of sections) {
        document.getElementById(section).style.display = "none"
    }
    document.getElementById(id).style.display = "flex"
}

const groups = {
    "Armed Forces": { color: "#ab946c", weight: 0 },
    "Devout": { color: "#4c9f70", weight: 0 },
    "Industrialists": { color: "#e98e3c", weight: 0 },
    "Intelligentsia": { color: "#ffda6d", weight: 0 },
    "Landowners": { color: "#9c85f3", weight: 0 },
    "Petite Bourgeoisie": { color: "#5b9ee1", weight: 0 },
    "Rural Folk": { color: "#7abe43", weight: 0 },
    "Trade Unions": { color: "#c64e4a", weight: 0 },
    "Inactive": { color: "#a0a0a0", weight: 0 }
}

const SOL = {
    "Destitute": 1,
    "Struggling": 5,
    "Impoverished": 10,
    "Middling": 15,
    "Secure": 20,
    "Prosperous": 25,
    "Affluent": 30,
    "Wealthy": 40,
    "Lavish": 50,
    "Opulent": 60
}

function updateSOL(value) {
    const sol = document.getElementById("sol")
    const [name] = Object.entries(SOL).filter(([, threshold]) => threshold <= value).at(-1)
    sol.replaceChildren()
    const icon = document.createElement("img")
    icon.src = `./icons/Standards of Living/${name}.png`
    icon.alt = name
    const label = document.createElement("div")
    label.textContent = name
    sol.append(icon, label)
}

function initializeStateReligion() {
    const button = document.getElementById("isStateReligion")
    function update() {
        const value = window.selectedValues.isStateReligion
        button.replaceChildren()
        const icon = document.createElement("img")
        icon.src = `./icons/Site/${value ? "Yes" : "No"}.png`
        icon.draggable = false
        const text = document.createElement("span")
        text.textContent = value ? "Yes" : "No"
        button.append(icon, text)
    }
    button.addEventListener("click", () => {
        window.selectedValues.isStateReligion = !window.selectedValues.isStateReligion
        update()
        window.updateInterestGroups()
    })
    update()
}

function updateInterestGroups() {
    const selected = window.selectedMenus
    const values = window.selectedValues
    const profession = selected.profession
    const sector = selected.sector
    const SOL = parseInt(selectedValues.standardOfLiving)
    let stratum = ""
    const weights = {
        "Armed Forces": 0,
        "Devout": 25,
        "Industrialists": 0,
        "Intelligentsia": 0,
        "Landowners": 0,
        "Petite Bourgeoisie": 0,
        "Rural Folk": 100,
        "Trade Unions": 0,
        "Inactive": 0
    }
    if (profession === "Aristocrat" || profession === "Capitalist") {
        stratum = "Upper"
    } else if (profession === "Academic" || profession === "Bureaucrat" || profession === "Clergyperson" || profession === "Engineer" || profession === "Farmer" || profession === "Officer" || profession === "Shopkeeper") {
        stratum = "Middle"
    } else {
        stratum = "Lower"
    }
    /*const professions = {
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
    }*/
    /* Additive */
    if (selected.acceptance === "Full Acceptance" || selected.acceptance === "Second-class Citizen") {
        weights["Armed Forces"] += 25
    }
    if (sector === "Military Industries") {
        if (stratum === "Upper") {
            weights["Armed Forces"] += 150
        }
        if (stratum === "Middle") {
            weights["Armed Forces"] += 75
        }
    }
    weights["Devout"] -= .15 * selectedValues.literacy
    if (selectedValues.literacy >= 50) {
        weights["Intelligentsia"] += .2 * selectedValues.literacy
    }
    if (stratum === "Lower" && SOL > 10) {
        weights["Petite Bourgeoisie"] += 2 * SOL
    }
    if (stratum === "Middle") {
        weights["Petite Bourgeoisie"] += 3 * SOL
        weights["Trade Unions"] -= 10 + SOL
    }
    if (sector !== "Organized Agriculture" && SOL >= 10) {
        weights["Petite Bourgeoisie"] += 2 * SOL
    }
    if (sector !== "Organized Agriculture") {
        weights["Trade Unions"] += 50
    }
    if (profession === "Academic") {
        weights["Intelligentsia"] += 250
    }
    if (profession === "Aristocrat") {
        weights["Armed Forces"] += 5
        if (selected.armyLaw === "Peasant Levies") {
            weights["Armed Forces"] += 50
        }
        if (selected.bureaucracyLaw === "Military Bureaucrats") {
            weights["Armed Forces"] += 50
        }
        if (selected.religion === "Sikh") {
            weights["Armed Forces"] += 100
        }
        if (selected.bureaucracyLaw === "Hereditary Bureaucrats") {
            weights["Intelligentsia"] += 75
        } else {
            weights["Intelligentsia"] += 25
        }
        if (sector === "Administrative Work") {
            weights["Intelligentsia"] += 100
        }
        weights["Landowners"] += 250
    }
    if (profession === "Bureaucrat") {
        if (selected.bureaucracyLaw === "Military Bureaucrats") {
            weights["Armed Forces"] += 100
        }
        weights["Intelligentsia"] += 150
        if (selected.bureaucracyLaw === "Elected Bureaucrats") {
            weights["Petite Bourgeoisie"] += 50
        }
    }
    if (profession === "Capitalist") {
        weights["Industrialists"] += 250 + SOL
        weights["Intelligentsia"] += 50
        if (sector === "Administrative Work") {
            weights["Intelligentsia"] += 100
        }
    }
    if (profession === "Clergyperson") {
        weights["Devout"] += 250
        if (sector === "Administrative Work") {
            weights["Intelligentsia"] += 100
        }
        weights["Landowners"] += 50
    }
    if (profession === "Clerk") {
        weights["Intelligentsia"] += 50
        weights["Petite Bourgeoisie"] += 75 + SOL
        weights["Trade Unions"] += 35 - SOL
        if (selected.bureaucracyLaw === "Communal Administration") {
            weights["Trade Unions"] += 75
        }
    }
    if (profession === "Engineer") {
        weights["Industrialists"] += 50 + 2 * SOL
        weights["Petite Bourgeoisie"] += 50
    }
    if (profession === "Farmer") {
        weights["Landowners"] += 25 + SOL
        if (selected.landLaw === "Peasant Proprietorship") {
            weights["Petite Bourgeoisie"] += 25
        }
        weights["Rural Folk"] += 200
    }
    /* Multiplicative */
    if (selected.acceptance === "Full Acceptance" || selected.acceptance === "Second-class Citizen") {
        if (selected.armyLaw === "Professional Army" && (profession !== "Officer" && profession !== "Serviceperson")) {
            weights["Armed Forces"] *= .5
        }
    }
    if (selected.churchLaw === "State Atheism") {
        weights["Devout"] *= .1
    }
    if (selected.churchLaw === "State Religion") {
        weights["Devout"] *= 1.5
    }
    if (selected.churchLaw === "Freedom of Conscience") {
        weights["Devout"] *= 1.25
    }
    if (profession === "Farmer") {
        if (selected.landLaw == "Peasant Proprietorship") {
            weights["Landowners"] *= 1.25
        }
    }
    if (profession === "Laborer") {
        weights["Trade Unions"] += 50
        if (sector !== "Organized Agriculture") {
            weights["Trade Unions"] += 50
        }
    }
    if (profession === "Machinist") {
        weights["Trade Unions"] += 150
    }
    if (profession === "Officer") {
        weights["Armed Forces"] += 250
        weights["Landowners"] += 25
    }
    if (profession === "Peasant") {
        weights["Devout"] += 100
        weights["Rural Folk"] += 200
    }
    if (profession === "Serviceperson") {
        weights["Armed Forces"] += 100
        if (selected.armyLaw === "Professional Army") {
            weights["Armed Forces"] += 50
        }
        if (selected.armyLaw === "Warrior Caste") {
            weights["Armed Forces"] += 100
        }
        if (sector === "Army Centers") {
            weights["Trade Unions"] += 25
        }
        if (selected.armyLaw === "Revolutionary Guard") {
            weights["Trade Unions"] += 75
        }
    }
    if (profession === "Shopkeeper") {
        weights["Industrialists"] += 25 + 2.5 * SOL
        weights["Petite Bourgeoisie"] + 150
    }
    /* Override */
    if (selected.acceptance === "Open Prejudice" || selected.acceptance === "Cultural Erasure" || selected.acceptance === "Violent Hostility") {
        if (profession !== "Aristocrat" && profession !== "Officer" && profession !== "Serviceperson") {
            weights["Armed Forces"] = 0
        }
        weights["Petite Bourgeoisie"] = 0
    }
    if (!selectedValues.isStateReligion || selected.religion === "Atheist") {
        weights["Devout"] = 0
    }
    if (selectedValues.literacy <= 25 || stratum == "Lower" || profession === "Officer" || profession === "Shopkeeper") {
        weights["Intelligentsia"] = 0
    }
    if (sector !== "Administrative Work" && sector !== "Civilian Industries" && sector !== "Military Industries" && sector !== "Resource Extraction" && sector !== "Urban Services") {
        if (stratum !== "Middle" || sector !== "Organized Agriculture" || (selected.landLaw !== "Peasant Proprietorship" && selected.landLaw !== "Commercialized Agriculture")) {
            weights["Petite Bourgeoisie"] = 0
        }
    }
    if (sector !== "Organized Agriculture" && sector !== "Resource Extraction" && sector !== "Subsistence Farming") {
        weights["Rural Folk"] = 0
    }
    if (stratum !== "Lower" || sector === "Subsistence Farming" || (selected.landLaw !== "Collectivized Agriculture" && selected.landLaw !== "Commercialized Agriculture")) {
        if (sector === "Organized Agriculture" || sector === "Subsistence Farming") {
            weights["Trade Unions"] = 0
        }
    }
    if (stratum === "Upper") {
        weights["Trade Unions"] = 0
        weights["Petite Bourgeoisie"] = 0
        weights["Rural Folk"] = 0
    }
    if (profession === "Officer") {
        weights["Trade Unions"] = 0
    }
    if (profession === "Slave" || profession === "Unemployed") {
        weights["Armed Forces"] = 0
        weights["Devout"] = 0
        weights["Industrialists"] = 0
        weights["Intelligentsia"] = 0
        weights["Landowners"] = 0
        weights["Petite Bourgeoisie"] = 0
        weights["Rural Folk"] = 0
        weights["Trade Unions"] = 0
        weights["Inactive"] = 1
    }
    for (const [key, value] of Object.entries(weights)) {
        if (value < 0) {
            weights[key] = 0
        }
    }
    generatePieChart(Object.keys(groups).map(name => weights[name]))
}

const menus = {
    profession: {
        title: "Choose a profession:",
        path: "./icons/Professions/",
        options: ["Academic", "Aristocrat", "Bureaucrat", "Capitalist", "Clergyperson", "Clerk", "Engineer", "Farmer", "Laborer", "Machinist", "Officer", "Peasant", "Serviceperson", "Shopkeeper", "Slave", "Unemployed"]
    },
    religion: {
        title: "Choose a religion:",
        path: "./icons/Religion/",
        options: ["Animist", "Atheist", "Catholic", "Confucian", "Coptic", "Gelugpa", "Hindu", "Ibadi", "Jewish", "Mahayana", "Orthodox", "Protestant", "Shiite", "Shinto", "Sikh", "Sunni", "Theravada"]
    },
    sector: {
        title: "Choose an economic sector:",
        path: "./icons/Buildings/",
        options: ["Administrative Work", "Army Centers", "Civilian Industries", "Military Industries", "Organized Agriculture", "Resource Extraction", "Urban Services", "Subsistence Farming", "None"]
    },
    acceptance: {
        title: "Choose an acceptance:",
        path: "./icons/Acceptance/",
        options: ["Full Acceptance", "Second-class Citizen", "Open Prejudice", "Cultural Erasure", "Violent Hostility"]
    },
    bureaucracyLaw: {
        title: "Choose a bureaucracy law:",
        path: "./icons/Power Structure/Bureaucracy/",
        options: ["Hereditary Bureaucrats", "Military Bureaucrats", "Appointed Bureaucrats", "Elected Bureaucrats", "Communal Administration"]
    },
    armyLaw: {
        title: "Choose an army law:",
        path: "./icons/Power Structure/Army Model/",
        options: ["Peasant Levies", "Professional Army", "National Militia", "Mass Conscription", "Revolutionary Guard", "Warrior Caste"]
    },
    churchLaw: {
        title: "Choose a church law:",
        path: "./icons/Power Structure/Church and State/",
        options: ["State Religion", "Freedom of Conscience", "Total Separation", "State Atheism"]
    },
    landLaw: {
        title: "Choose a land law:",
        path: "./icons/Economy/Land Reform/",
        options: ["Serfdom", "Tenant Farmers", "Commercialized Agriculture", "Peasant Proprietorship", "Collectivized Agriculture"]
    },
    colonialLaw: {
        title: "Choose a colonial law:",
        path: "./icons/Economy/Colonization/",
        options: ["No Colonial Affairs", "Internal Colonization", "Frontier Colonization", "Colonial Resettlement", "Colonial Exploitation"]
    }
}

window.selectedMenus = {}

function generateMenus(menus) {
    for (const [id, menu] of Object.entries(menus)) {
        const element = document.getElementById(id)
        element.className = "menu"
        const title = document.createElement("div")
        title.className = "menuTitle"
        title.textContent = menu.title
        const grid = document.createElement("div")
        grid.id = `${id}Grid`
        grid.className = "menuGrid"
        element.replaceChildren(title, grid)
        if (!menu.options.length)
            throw new Error(`Menu "${id}" has no options.`)
        window.selectedMenus[id] = menu.options[0]
        menu.options.forEach((name, index) => {
            const button = document.createElement("button")
            button.className = "menuButton"
            button.type = "button"
            button.classList.toggle("selected", index === 0)
            const icon = document.createElement("img")
            icon.src = `${menu.path}${encodeURIComponent(name)}.png`
            icon.draggable = false
            const text = document.createElement("div")
            text.textContent = name
            button.append(icon, text)
            grid.appendChild(button)
            button.addEventListener("click", () => {
                grid.querySelector(".selected")?.classList.remove("selected")
                button.classList.add("selected")
                window.selectedMenus[id] = name
                window.updateInterestGroups()
            })
        })
    }
}

window.selectedValues = {
    standardOfLiving: document.getElementById("standardOfLiving").value,
    literacy: document.getElementById("literacy").value,
    isStateReligion: true
}

function initializeInputs() {
    const inputs = {
        standardOfLiving: document.getElementById("standardOfLiving"),
        literacy: document.getElementById("literacy")
    }
    updateSOL(window.selectedValues.standardOfLiving)
    for (const [id, input] of Object.entries(inputs)) {
        input.addEventListener("input", () => {
            const min = Number(input.min)
            const max = Number(input.max)
            const value = Math.min(max, Math.max(min, Math.round(Number(input.value))))
            if (input.value !== "" && Number.isFinite(value)) {
                input.value = value
                window.selectedValues[id] = value
                if (id === "standardOfLiving") updateSOL(value)
                window.updateInterestGroups()
            }
        })
    }
}

function generatePieList(ratios) {
    const list = document.getElementById("pieList")
    const total = ratios.reduce((sum, ratio) => sum + ratio, 0)
    list.replaceChildren()
    Object.entries(groups).forEach(([name, group], i) => {
        const percentage = total === 0 ? 0 : ratios[i] / total * 100
        const item = document.createElement("div")
        item.className = "pieListItem"
        const icon = document.createElement("img")
        icon.src = `./icons/Interest Groups/${name}.png`
        icon.alt = name
        const label = document.createElement("div")
        label.textContent = name
        const value = document.createElement("div")
        value.textContent = `${percentage.toFixed(1)}%`
        item.append(icon, label, value)
        list.appendChild(item)
    })
}

function generatePieChart(ratios) {
    const chart = document.getElementById("pieChart")
    const icons = document.getElementById("pieIcons")
    const centerIcon = document.getElementById("pieCenterIcon")
    const centerName = document.getElementById("pieCenterName")
    const center = document.getElementById("pieCenter")
    const total = ratios.reduce((sum, ratio) => sum + ratio, 0)
    icons.replaceChildren()
    if (total === 0) {
        chart.style.background = "#808080"
        center.style.display = "none"
        return
    }
    center.style.display = "flex"
    const entries = Object.entries(groups).map(([name, group], i) => ({
        name,
        color: group.color,
        ratio: ratios[i]
    }))
    const largest = entries.reduce((a, b) => b.ratio > a.ratio ? b : a)
    centerIcon.src = `./icons/Interest Groups/${largest.name}.png`
    centerName.textContent = `${largest.name} (${(largest.ratio / total * 100).toFixed(1)}%)`
    const radius = chart.offsetWidth * 0.436
    let percentage = 0
    const gradient = []
    entries.forEach(({ name, color, ratio }) => {
        const share = ratio / total * 100
        const nextPercentage = percentage + share
        gradient.push(`${color} ${percentage}% ${nextPercentage}%`)
        if (share >= 5) {
            const radians = (percentage + nextPercentage) / 2 * 3.6 * Math.PI / 180 - Math.PI / 2
            const icon = document.createElement("img")
            icon.src = `./icons/Interest Groups/${name}.png`
            icon.alt = name
            icon.title = name
            icon.style.left = `${chart.offsetWidth / 2 + Math.cos(radians) * radius}px`
            icon.style.top = `${chart.offsetHeight / 2 + Math.sin(radians) * radius}px`
            icons.appendChild(icon)
        }
        percentage = nextPercentage
    })
    chart.style.background = `conic-gradient(${gradient.join(", ")})`
    generatePieList(ratios)
}
generateMenus(menus)
initializeInputs()
initializeStateReligion()
window.updateInterestGroups()