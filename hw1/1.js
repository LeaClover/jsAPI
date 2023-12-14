// Статическая веб-страница с динамическими элементами:
// Создайте HTML-страницу с заголовком "Расписание занятий".

// Таблица с информацией о занятиях:
// Используйте JavaScript для динамического создания таблицы на основе JSON-данных.
// Каждая строка таблицы должна содержать информацию о занятии: название, время проведения, максимальное и текущее количество участников.
// 3. Кнопки "Записаться" и "Отменить запись":

// Рядом с каждым занятием добавьте кнопку "Записаться".
// Если максимальное количество участников достигнуто, сделайте кнопку неактивной.
// Предусмотрите кнопку "Отменить запись", которая появляется после записи на занятие.
// 4. Интерактивность с JavaScript:

// При нажатии на кнопку "Записаться" увеличьте количество записанных участников.
// Если пользователь нажимает "Отменить запись", уменьшите количество записанных участников.
// Обновляйте состояние кнопок и количество участников в реальном времени.
// 5. Дополнительно: Хранение данных в Local Storage:

// Сохраняйте изменения в Local Storage, чтобы они сохранялись при перезагрузке страницы.

async function fetchData() {
    try {
        const responce = await fetch('data.json');
        if (!responce.ok) {
            throw new Error('Не удалось получить данные с JSON');
        }
        const data = await responce.json();
        const div = document.querySelector('.lessons');

        data.forEach(({ id, name, time, maxParticipants, currentParticipants }) => {
            const lessonCart = `<div class="lesson-item">
                <div class="lesson id">${id}</div>
                <div class="lesson name">${name}</div>
                <div class="lesson time">${time}</div>
                <div class="lesson max-participants">${maxParticipants}</div>
                <div class="lesson current-participants">${currentParticipants}</div>
                <button class="add">Записаться</button>
            </div>`;
            div.insertAdjacentHTML('beforeend', lessonCart);
        });
        let btns = document.querySelectorAll('.add');
        btns.forEach(btn => {
            btn.addEventListener('click', addLesson)
        });
    } catch (error) {
        console.error(error);
    }
}

function addLesson(event) {
    const parent = event.target.parentNode;
    const textContCurrent = event.target.previousElementSibling.textContent;
    const textContentMax = event.target.previousElementSibling.previousElementSibling.textContent;
    if(parent.querySelector('.delete') === null ) {
        console.log(event.target.previousElementSibling.textContent);
        console.log(textContentMax);
        if(event.target.previousElementSibling.textContent === textContentMax ) {
            event.target.setAttribute('disabled', '');
            event.target.style.background = 'grey';
            setTimeout(() => {
                event.target.disabled = false;
                event.target.style.background = 'lawngreen';
            }, 5000);
            alert('Вы не можете записаться, мест больше нет!');
        } else {
            event.target.previousElementSibling.textContent = Number(textContCurrent) + 1;
            event.target.setAttribute('disabled', '');
            event.target.style.background = 'grey';
            const delButton = document.createElement('button');
            delButton.className = 'delete';
            delButton.textContent = 'Отменить запись';
            delButton.addEventListener('click', deleteLesson)
            parent.appendChild(delButton);
        } 
    }
    addToLS()
}

function deleteLesson(event) {
    const textCont = event.target.previousElementSibling.previousElementSibling.textContent;
    event.target.previousElementSibling.previousElementSibling.textContent = Number(textCont) - 1;
    event.target.previousElementSibling.disabled = false;
    event.target.previousElementSibling.style = 'lawngreen';
    event.target.remove();
    addToLS()
}

function addToLS() {
    const arrayLS = []
    const items = document.querySelectorAll('.lesson-item')
    let status = false;
    items.forEach(item => {
        if(item.querySelector('.delete') !== null) {
            status = true;
        } else {
            status = false;
        }
        arrayLS.push({id: item.firstElementChild.textContent, name: item.firstElementChild.nextElementSibling.textContent, 
            time: item.firstElementChild.nextElementSibling.nextElementSibling.textContent,
            maxParticipants: item.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent, 
            currentParticipants: item.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent, status: status})
    });
    const JSONdata = JSON.stringify(arrayLS);
    localStorage.setItem('lessons-data', JSONdata)
}

function loadFromLS() {
    const data = JSON.parse(localStorage.getItem('lessons-data'));
    if (data !== null) {
        const lessonsBlock = document.querySelector('.lessons');
        // while (lessonsBlock.children.length > 1) {
        //     lessonsBlock.removeChild(lessonsBlock.lastChild);
        // }
        console.log(lessonsBlock);
        data.forEach(({ id, name, time, maxParticipants, currentParticipants, status }) => {
            const lessonCart = `<div class="lesson-item">
                <div class="lesson id">${id}</div>
                <div class="lesson name">${name}</div>
                <div class="lesson time">${time}</div>
                <div class="lesson max-participants">${maxParticipants}</div>
                <div class="lesson current-participants">${currentParticipants}</div>
                <button class="add">Записаться</button>
            </div>`;
            lessonsBlock.insertAdjacentHTML('beforeend', lessonCart);
            if(status === true) {
                const delBtn = document.createElement('button');
                delBtn.className = 'delete';
                delBtn.textContent = 'Отменить запись';
                lessonsBlock.lastChild.appendChild(delBtn);
                const addBtn = delBtn.previousElementSibling;
                addBtn.setAttribute('disabled', '');
                addBtn.style.background = 'grey';
                delBtn.addEventListener('click', deleteLesson)
            }
        });
        let btns = document.querySelectorAll('.add');
        btns.forEach(btn => {
            btn.addEventListener('click', addLesson)
        });
    } else {
        fetchData();
    }
}

window.addEventListener('load', loadFromLS);
window.addEventListener('close', addToLS);