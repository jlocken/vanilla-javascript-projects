import ToDoList from "./todoList.js";
import ToDoItem from "./todoItem.js";



const toDoList = new ToDoList();

//Launch app
document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();     
    }
});

const initApp = () => {
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit",(event) => {
        event.preventDefault();
        processSubmission();
    })

    const clearItems = document.getElementById("clearItems");
    clearItems.addEventListener("click", event => {
        const list = toDoList.getList();

        if(list.length) {
            const confirmed = confirm("Are you sure you want to clear the entire list?");
            if(confirmed) {
                toDoList.clearList();
                updatePersistentData(toDoList);
                refreshThePage();
            }
        }
    })
    loadListObject()
    refreshThePage();
}

const loadListObject = () => {
    const storedList = localStorage.getItem("myToDoList");
    if ( typeof storedList !== "string") return;

    const parsedList= JSON.parse(storedList);
    parsedList.forEach(todo => {
        const newToDoItem = createNewItem(todo._id, todo._item)
        toDoList.addItemToList(newToDoItem);
    });
}

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
}

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");
    deleteContents(parentElement);
}

const deleteContents = (parentElement) => {

    let child = parentElement.lastElementChild;
    while(child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;

    }
}


const renderList =() => {
    const list = toDoList.getList();

    list.forEach(item => {
        buildListItem(item);
    })
}

const buildListItem = (item) => {
    const div = document.createElement("div");
    div.className = "item";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = item.getId();
    input.tabIndex="0";
    addClickListenerToCheckbox(input);
    const label = document.createElement("label");
    label.htmlFor= item.getId();
    label.textContent =item.getItem();
    div.appendChild(input);
    div.append(label);
    const container = document.getElementById("listItems");
    container.appendChild(div);

}


const addClickListenerToCheckbox = (input) => {

    input.addEventListener("click", (event) => {
        toDoList.removeItemFromList(input.id);
        updatePersistentData(toDoList.getList());
        refreshThePage();
    })

}
const updatePersistentData = (listArray) => {
    localStorage.setItem("myToDoList", JSON.stringify(listArray) )

}

const clearItemEntryField = () => {
    document.getElementById("newItem").value ="";
}

const setFocusOnItemEntry = () => {
    document.getElementById("newItem").focus();
}

const processSubmission = () => {
    const newEntryText = getNewEntry();  
    if (!newEntryText) return;
    const nextItemId = calcNextItemId(); 
    const todoItem = createNewItem(nextItemId, newEntryText) 
    toDoList.addItemToList(todoItem);
    updatePersistentData(toDoList)
    refreshThePage();

    
}

const getNewEntry = () => {
    return document.getElementById("newItem").value.trim();
}

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = toDoList.getList();
    if(list.length>0) {
        nextItemId = list[list.length-1].getId()+1;
    }
    return nextItemId;
}

const createNewItem = (itemId, itemText) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);
    return toDo;
}