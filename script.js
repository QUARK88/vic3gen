import * as htmlToImage from "https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/+esm"

let lawsData

const groupIds = {
    "Power Structure": "power",
    "Economy": "economy",
    "Human Rights": "rights"
}

function getIconPath(group, category, law) {
    return `./icons/${[group, category, law].map(encodeURIComponent).join("/")}.png`
}

function getLawElement(group, category) {
    const groupElement = document.getElementById(groupIds[group])
    return [...groupElement.querySelectorAll(".law")].find(element => element.dataset.category === category)
}

async function loadLaws() {
    const response = await fetch("./laws.json")
    lawsData = await response.json()

    for (const [groupName, categories] of Object.entries(lawsData)) {
        const groupElement = document.getElementById(groupIds[groupName])
        const groupTitle = groupElement.querySelector(".groupName")
        groupTitle.textContent = groupName
        groupTitle.removeAttribute("href")

        for (const [categoryName, laws] of Object.entries(categories)) {
            const savedLaw = localStorage.getItem(`law_${groupName}_${categoryName}`)
            const lawName = Object.hasOwn(laws, savedLaw) ? savedLaw : Object.keys(laws)[0]
            const law = laws[lawName]

            const lawElement = document.createElement("div")
            lawElement.className = "law"
            lawElement.dataset.category = categoryName
            lawElement.title = `${lawName}\n\n${law.description}`

            const icon = document.createElement("img")
            icon.className = "icon"
            icon.src = getIconPath(groupName, categoryName, lawName)
            icon.draggable = false

            const category = document.createElement("div")
            category.className = "categoryName"
            category.textContent = categoryName

            const name = document.createElement("div")
            name.className = "lawName"
            name.textContent = lawName

            const amount = document.createElement("div")
            amount.className = "lawAmount"
            amount.textContent = Object.keys(laws).length

            const swap = document.createElement("img")
            swap.className = "lawSwap"
            swap.src = "./icons/Site/Swap.png"
            swap.draggable = false

            lawElement.append(icon, category, name, amount, swap)
            groupElement.appendChild(lawElement)
            lawElement.addEventListener("click", () => openLawMenu(groupName, categoryName, lawElement))
        }
    }
    show("sectionLaws")
}

function openLawMenu(group, category, lawElement) {
    const backdrop = document.getElementById("lawBackdrop")
    const menu = document.getElementById("lawMenu")
    const laws = lawsData[group][category]

    menu.className = "group"
    menu.innerHTML = `<div class="groupName">${category}</div>`

    for (const [lawName, law] of Object.entries(laws)) {
        const option = document.createElement("div")
        option.className = "law"
        option.title = `${lawName}\n\n${law.description}`

        const icon = document.createElement("img")
        icon.className = "icon"
        icon.src = getIconPath(group, category, lawName)
        icon.draggable = false

        const categoryName = document.createElement("div")
        categoryName.className = "categoryName"
        categoryName.textContent = category

        const name = document.createElement("div")
        name.className = "lawName"
        name.textContent = lawName

        option.append(icon, categoryName, name)
        menu.appendChild(option)

        option.addEventListener("click", event => {
            event.stopPropagation()
            setLaw(lawName, law, lawElement, group, category)
            closeLawMenu()
        })
    }

    backdrop.classList.add("open")
}

function closeLawMenu() {
    const backdrop = document.getElementById("lawBackdrop")
    const menu = document.getElementById("lawMenu")
    backdrop.classList.remove("open")
    menu.innerHTML = ""
}

document.getElementById("lawBackdrop").addEventListener("click", event => {
    if (event.target === event.currentTarget) closeLawMenu()
})

function setLaw(lawName, law, lawElement, group, category) {
    lawElement.querySelector(".icon").src = getIconPath(group, category, lawName)
    lawElement.querySelector(".lawName").textContent = lawName
    lawElement.title = `${lawName}\n\n${law.description}`
    localStorage.setItem(`law_${group}_${category}`, lawName)
}

document.getElementById("reset").addEventListener("click", () => {
    for (const [group, categories] of Object.entries(lawsData)) {
        for (const [category, laws] of Object.entries(categories)) {
            const lawName = Object.keys(laws)[0]
            setLaw(lawName, laws[lawName], getLawElement(group, category), group, category)
        }
    }
})

document.getElementById("download").addEventListener("click", async () => {
    try {
        const element = document.getElementById("groups")
        if (!element) throw new Error("Element not found")
        const dataURL = await htmlToImage.toPng(element, {
            backgroundColor: null,
            width: element.offsetWidth,
            height: element.offsetHeight,
            cacheBust: true
        })
        const link = document.createElement("a")
        link.href = dataURL
        link.download = "Victoria 3 Laws.png"
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        console.error("Screenshot failed:", error)
        alert("Screenshot downloading is not supported on this browser.")
    }
})

document.getElementById("randomize").addEventListener("click", () => {
    for (const [group, categories] of Object.entries(lawsData)) {
        for (const [category, laws] of Object.entries(categories)) {
            const lawNames = Object.keys(laws)
            const lawName = lawNames[Math.floor(Math.random() * lawNames.length)]
            setLaw(lawName, laws[lawName], getLawElement(group, category), group, category)
        }
    }
})

loadLaws()