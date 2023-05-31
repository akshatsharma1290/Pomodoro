const minute = document.querySelector(".minute")
const seconds = document.querySelector(".seconds")
const timer_state = document.querySelector(".timer-state")
const active_part = document.querySelector(".active-part")
const parts = Array.from(document.querySelectorAll(".part"))
const zero = document.querySelector(".zero")
const timer = document.querySelector(".time")
const timeBar = document.querySelector(".time-bar")
const settings = document.querySelector(".setting-modal")
const open = document.querySelector(".setting-icon")
const close = document.querySelector(".quit")
const timeValue = Array.from(document.querySelectorAll(".value"))
const carets = Array.from(document.querySelectorAll(".carets i"))
const fonts = Array.from(document.querySelectorAll(".fonts p"))
const colors = Array.from(document.querySelectorAll(".colors span"))
const apply_btn = document.querySelector(".apply-btn")
const inps = Array.from(document.querySelectorAll(".inputs div"))
const title = document.getElementsByTagName("title")[0]
const timerAlarm = new Audio("alarm.mp3")
let int
let state
let started
let activeFont = "1"
let activeColor = "1"
let modeRunning = "pomodoro"
let time
let barValue


localStorage.setItem("pomodoro", 25)
localStorage.setItem("shortbreak", 5)
localStorage.setItem("longbreak", 15)


function times() {
    time = {
        "pomodoro": localStorage.getItem("pomodoro"),
        "short break": localStorage.getItem("shortbreak"),
        "long break": localStorage.getItem("longbreak")
    }
    minute.textContent = time[modeRunning]
}
times()



const gap = {
    1: 0.5,
    2: 12,
    3: 24
}

const mediaQuery1 = window.matchMedia('(max-width: 768px)')
const mediaQuery2 = window.matchMedia('(769px <= width <= 1100px)')
const mediaQuery3 = window.matchMedia('(min-width: 1111px)')


function barSlideChange(x) {

    if (x.matches) {
        gap[1] = 1
        gap[2] = 31
        gap[3] = 61

    }

}

function barSlideChange2(y) {
    if (y.matches) {

        gap[1] = 2
        gap[2] = 21
        gap[3] = 41
    }
}

function barSlideChange3(z) {
    if (z.matches) {

        gap[1] = 0.5
        gap[2] = 12
        gap[3] = 24
    }
}


mediaQuery1.addEventListener("change", barSlideChange)
mediaQuery2.addEventListener("change", barSlideChange2)
mediaQuery2.addEventListener("change", barSlideChange3)
barSlideChange(mediaQuery1)
barSlideChange2(mediaQuery2)
barSlideChange3(mediaQuery3)


function activeMode(x, y) {
    active_part.style.left = `${x}vw`
    minute.textContent = y
}

function setDefault() {
    minute.textContent = time[modeRunning]
    seconds.textContent = "00"
    zero.textContent = ""
    timer_state.textContent = "START"

}

function valuesReset(e) {
    minute.textContent = e.dataset.timing
    seconds.textContent = "00"
    zero.textContent = ""
    timer_state.textContent = "START"
    state = ""
    timeBar.style.background = `conic-gradient( var(--main-color) 360deg , transparent 0deg)`

}

function modeSwitch(e) {
    modeRunning = e.dataset.mode
    activeMode(gap[e.dataset.part], time[e.dataset.mode])
    e.classList.add("active")
    for (const i of parts) {
        if (i != e) i.classList.remove("active")
    }
}

parts.forEach((e) => {
    e.addEventListener("click", () => {
        if (e.dataset.mode != modeRunning && started != true) {
            modeSwitch(e)
        } else if (e.dataset.mode != modeRunning && started == true) {
            let conf = confirm("Timer is running. Are you sure you want to switch mode?")
            if (conf == true) {
                started = false
                clearInterval(int)
                valuesReset(e)
                modeSwitch(e)
            }
        }


    })
})


function timerRun() {
    if (started != true) {
        barValue = 360 / (time[modeRunning] * 60)
        timeBar.style.background = `conic-gradient( var(--main-color) 0deg , transparent 0deg)`
        minute.textContent--
        seconds.textContent = "59"
    }
    started = true
    if (state == "running") {
        state = "paused"
        timer_state.textContent = "RESUME"
        clearInterval(int)
    } else {
        timer_state.textContent = "PAUSE"
        state = "running"

        int = setInterval(() => {
            barValue += 360 / (time[modeRunning] * 60)

            title.textContent = ` Pomodoro timer ${minute.textContent} : ${zero.textContent}${seconds.textContent}`

            timeBar.style.background = `conic-gradient( var(--main-color) ${barValue}deg , transparent 0deg)`
            if (minute.textContent == "0" && seconds.textContent == "0") {
                title.textContent = "Pomodoro Timer"
                clearInterval(int)
                started = false
                state = ""
                setDefault()
                timerAlarm.play()

            } else if (seconds.textContent == "0") {
                zero.textContent = ""
                seconds.textContent = 59
                minute.textContent--
            } else {
                if (seconds.textContent == "10") {
                    zero.textContent = "0"
                }
                seconds.textContent--
            }

        }, 1000);
    }


}


carets.forEach((elem) => {
    elem.addEventListener("click", () => {
        if (elem.dataset.task == "up") {
            timeValue[elem.dataset.caret].textContent++
        } else {

            timeValue[elem.dataset.caret].textContent--
        }

    })

})

timeValue.forEach((x) => {

    x.addEventListener("keypress", (e) => {

        if (/[^0-9]/.test(e.key)) {
            e.preventDefault()
        }

    })

})

fonts.forEach((y) => {
    y.addEventListener("click", () => {
        y.classList.add("active-font")
        activeFont = y.dataset.font
        for (const i of fonts) {
            if (i != y) {
                i.classList.remove("active-font")
            }
        }
    })
})


colors.forEach((y) => {
    y.addEventListener("click", () => {
        y.classList.add("active-color")
        activeColor = y.dataset.color
        for (const i of colors) {
            if (i != y) {
                i.classList.remove("active-color")
            }
        }
    })
})

apply_btn.addEventListener("click", () => {
    settings.close()
    localStorage.setItem("pomodoro", timeValue[0].textContent)
    localStorage.setItem("shortbreak", timeValue[1].textContent)
    localStorage.setItem("longbreak", timeValue[2].textContent)
    times()

    for (const i of fonts) {
        if (i.matches(".active-font")) {
            document.documentElement.style.setProperty("--main-font", `var(--font-${i.dataset.font})`)
        }
    }
    for (const i of colors) {
        if (i.matches(".active-color")) {
            document.documentElement.style.setProperty("--main-color", `var(--color-${i.dataset.color})`)
        }
    }

})



timer.addEventListener("click", () => {
    timerRun()
})

open.addEventListener("click", () => {
    settings.showModal()
})
close.addEventListener("click", () => {
    settings.close()
})
