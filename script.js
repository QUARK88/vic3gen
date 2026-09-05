import * as htmlToImage from "https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/+esm"

let lawsData

async function loadLaws() {
    const response = await fetch("./laws.json")
    lawsData = await response.json()
    lawsData.groups.forEach(group => {
        const groupElement = document.getElementById(group.id)
        const groupName = groupElement.querySelector(".groupName")
        groupName.textContent = group.name
        groupName.href = group.link
        group.categories.forEach(category => {
            const savedLaw = localStorage.getItem(`law_${group.id}_${category.id}`)
            const law = category.laws.find(law => law.name === savedLaw) || category.laws[0]
            const lawElement = document.createElement("div")
            lawElement.className = "law"
            lawElement.dataset.category = category.id
            lawElement.title = law.description
            const icon = document.createElement("img")
            icon.className = "icon"
            icon.src = law.icon
            icon.draggable = false
            const categoryName = document.createElement("div")
            categoryName.className = "categoryName"
            categoryName.textContent = category.name
            const lawName = document.createElement("div")
            lawName.className = "lawName"
            lawName.textContent = law.name
            const lawAmount = document.createElement("div")
            lawAmount.className = "lawAmount"
            lawAmount.textContent = category.laws.length
            const lawSwap = document.createElement("img")
            lawSwap.className = "lawSwap"
            lawSwap.src = "swap.png"
            lawSwap.draggable = false
            lawElement.append(icon, categoryName, lawName, lawAmount, lawSwap)
            groupElement.appendChild(lawElement)
            lawElement.addEventListener("click", () => openLawMenu(group, category, lawElement))
        })
    })
}

function openLawMenu(group, category, lawElement) {
    const backdrop = document.getElementById("lawBackdrop")
    const menu = document.getElementById("lawMenu")
    menu.className = "group"
    menu.innerHTML = `<a class="groupName" href="${category.link}" title="See the wiki page">${category.name}</a>`
    category.laws.forEach(law => {
        const option = document.createElement("div")
        option.className = "law"
        const icon = document.createElement("img")
        icon.className = "icon"
        icon.src = law.icon
        icon.draggable = false
        const categoryName = document.createElement("div")
        categoryName.className = "categoryName"
        categoryName.textContent = category.name
        const lawName = document.createElement("div")
        lawName.className = "lawName"
        lawName.textContent = law.name
        option.title = law.description
        option.append(icon, categoryName, lawName)
        menu.appendChild(option)
        option.addEventListener("click", event => {
            event.stopPropagation()
            setLaw(law, lawElement, group, category)
            closeLawMenu()
        })
    })
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

function setLaw(law, lawElement, group, category) {
    lawElement.querySelector(".icon").src = law.icon
    lawElement.querySelector(".lawName").textContent = law.name
    lawElement.title = law.description
    localStorage.setItem(`law_${group.id}_${category.id}`, law.name)
}

document.getElementById("reset").addEventListener("click", () => {
    lawsData.groups.forEach(group => {
        group.categories.forEach(category => {
            const lawElement = document.querySelector(
                `#${group.id} .law[data-category="${category.id}"]`
            )
            setLaw(category.laws[0], lawElement, group, category)
        })
    })
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
    lawsData.groups.forEach(group => {
        group.categories.forEach(category => {
            const lawElement = document.querySelector(
                `#${group.id} .law[data-category="${category.id}"]`
            )

            const law = category.laws[Math.floor(Math.random() * category.laws.length)]
            setLaw(law, lawElement, group, category)
        })
    })
})

loadLaws()